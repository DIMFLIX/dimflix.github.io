---
date: 2026-01-26T11:17:00Z
updatedAt: 2026-01-26T11:17:00Z
title: "BlueVein"
excerpt: "How I spent a month to avoid wasting 56 hours a year reconnecting Bluetooth devices in dual-boot"
keywords:
  - bluetooth
  - dualboot
  - linux
  - windows
  - synchronization
  - ble
  - bluetooth-key-sync
  - bt-dualboot
  - bluetooth-sync
  - meowrch
---

# If you use a dual-boot system, you know this problem

Imagine this situation: you're working in Linux while listening to music through your favorite Bluetooth headphones. Everything works perfectly. The workday ends and you reboot to Windows to relax and play some games. You want to connect the same headphones, but suddenly... They don't work...

Naturally, you start troubleshooting, open Bluetooth settings and click the "Connect" button. But after 10 seconds of waiting, nothing happens. The system sees the headphones in Bluetooth, they're paired, but you can't connect to them. You have to remove the device and pair it again.

The next day you return to Linux. And... **the same story**. Remove again, pair again.

![Dual boot frustration](https://www.castoriscausa.com/images/bluetooth_dual.png?w=800&h=500&fit=crop)

**This happens every damn time.**

With Sony WH-1000XM5 headphones. With AirPods Pro. With an Xbox controller. With every freaking Bluetooth device.

# Let's do some math

Reconnecting one device takes about 1-3 minutes of your time:
- Open Bluetooth settings → 10 sec
- Find the device → 10 sec  
- Remove old pairing → 5 sec
- Put device in pairing mode → 15 sec
- Reconnect → 30 sec
- Check functionality → 20 sec

**Total: ~90 seconds per device.**

I use 3 Bluetooth devices (headphones, mouse, keyboard). I switch between OSes 3 times a day.

```
3 devices × 90 seconds × 3 switches = 13.5 minutes per day
13.5 minutes × 250 working days = 3375 minutes per year
3375 minutes = 56.25 hours = 2.3 full days
```

**I was spending more than two full days a year reconnecting Bluetooth devices!!!**

# Why does this happen?

The problem lies in how Bluetooth encryption works:

During initial pairing, devices exchange cryptographic keys:
- **LTK (Long Term Key)** — main encryption key
- **IRK (Identity Resolving Key)** — privacy key (random MAC addresses)
- **CSRK (Connection Signature Resolving Key)** — data signature key

These keys are saved in the OS:
- **Windows:** in registry `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\BTHPORT\Parameters\Keys`
- **Linux:** in BlueZ files `/var/lib/bluetooth/[MAC]/[DEVICE]/info`

**But the catch is that each OS generates its own keys**.

When switching between Windows and Linux:
1. The device finds your computer by Bluetooth adapter MAC address
2. Attempts to establish encrypted connection with saved key
3. Key doesn't match what's stored in current OS
4. Connection is rejected
5. Device requires re-pairing

A Bluetooth device can store **only one key** per host. Therefore, each new pairing overwrites the previous key.

# Existing "solutions"

## Option 1: Manual synchronization

Technically advanced users copy keys manually:
1. Boot into Windows
2. Export keys from registry
3. Reboot into Linux  
4. Convert key format
5. Insert into BlueZ configuration files
6. Restart Bluetooth service

But this method carries some risks and inconveniences:
- Needs to be done after each new pairing
- Requires access to Windows partition from Linux (and vice versa)
- Easy to make mistakes in format or key location
- Risk of damaging Windows system registry

## Option 2: bt-dualboot

There's a utility called [bt-dualboot](https://github.com/x2es/bt-dualboot) that attempts to automate the process.

But it's not all perfect:
1. Requires manual launch after each pairing. No automation.
2. No bidirectional synchronization support. Only works from Linux.
3. Requires mounting Windows partition with write permissions.
4. Uses hacker methods ([chntpw](https://www.kali.org/tools/chntpw/)) to modify Windows registry. Chntpw was originally created for system cracking.
5. Project abandoned since 2022. Existing issues remain unanswered.

# BlueVein — my solution

After yet another time spending 10 minutes reconnecting all devices, I had enough. I decided the problem should be solved automatically.

I spent a month developing [BlueVein](https://github.com/meowrch/BlueVein) — a cross-platform tool for automatic Bluetooth key synchronization between Linux and Windows.

## Core principles
- **Full automation** — install and forget  
- **Real-time synchronization** — changes applied instantly  
- **Bidirectional operation** — doesn't matter which OS you pair in  
- **BLE support** — all key types (LTK, IRK, CSRK)  
- **Security** — system-level operation with administrator privileges  
- **Zero configuration** — no need to specify paths, partitions, or configure anything

# How does it work?

The system consists of three components:

## 1. Monitoring on each OS

Linux systemd service:
- Monitors changes in `/var/lib/bluetooth/`
- Tracks D-Bus events from BlueZ
- Applies updates to local devices

Windows service:
- Monitors registry `BTHPORT\Parameters\Keys`
- Uses WinAPI to receive Bluetooth events
- Updates keys in registry

## 2. Shared storage in EFI

Keys are saved to JSON file on EFI partition: `/EFI/BlueVein/bluevein.json`

Why EFI?
- Accessible from any OS without mounting
- Independent of BitLocker/LUKS encryption
- Protected by access permissions (root/admin only)
- Standard location on all modern systems

## 3. Direct FAT32 access

For EFI operations, I wrote my own library [fat32-raw](https://github.com/meowrch/fat32-raw), which reads/writes FAT32 directly without mounting.

**Advantages:**
- Doesn't require mounting permissions
- Works even if EFI isn't in /etc/fstab
- Faster than standard I/O
- Cross-platform (Windows can also read EFI)

## Architectural diagram
<a href="https://github.com/meowrch/BlueVein"><img src="https://raw.githubusercontent.com/meowrch/BlueVein/refs/heads/main/.meta/architectural_scheme.png" border="0"></a>

# Synchronization algorithm

## Scenario 1: System boot

<a href="https://github.com/meowrch/BlueVein"><img src="https://raw.githubusercontent.com/meowrch/BlueVein/refs/heads/main/.meta/loading_the_system.png" alt="diagram 2 - system boot" border="0"></a>

**In simple terms:**
1. BlueVein launches as system service
2. Reads keys from `bluevein.json`
3. Checks local Bluetooth devices
4. If key in EFI is newer — updates local
5. If system has new device — adds to EFI

## Scenario 2: New pairing

<a href="https://github.com/meowrch/BlueVein"><img src="https://raw.githubusercontent.com/meowrch/BlueVein/refs/heads/main/.meta/new_pairing.png" alt="diagram 3 - new pairing" border="0"></a>

**In simple terms:**
1. You pair a new device in any OS
2. BlueVein receives event about new device
3. Extracts encryption keys
4. Saves to `bluevein.json`
5. On next boot of other OS, device works automatically

# Technical implementation details

## Bluetooth LE support

BlueVein fully supports Bluetooth Low Energy with all key types:

| Key Type           | Purpose                                                    | Support |
| ------------------ | ---------------------------------------------------------- | ------- |
| **LTK**            | Long Term Key — main encryption key                        | Full    |
| **Peripheral LTK** | LTK for device in peripheral role                          | Full    |
| **IRK**            | Identity Resolving Key — for privacy (random MAC)          | Full    |
| **CSRK**           | Connection Signature Resolving Key — for data signature    | Full    |
| **AddressType**    | Address type (public/random)                               | Full    |

## Where are keys stored?

Encryption keys are stored on EFI partition: `/EFI/BlueVein/bluevein.json`

Of course you'll ask — is this secure?
And I'll say — yes. Here's why:
- EFI is only accessible with root/admin permissions
- File has restricted access permissions (600)
- BlueVein runs as system service with elevated privileges
- Source code is open — you can verify yourself

## What about disk encryption?

BlueVein works independently of BitLocker (Windows) or LUKS (Linux).

EFI partition is usually not encrypted and accessible before OS boot. This is necessary for bootloader operation (GRUB, systemd-boot).

## Can it be hacked?

Theoretically, if an attacker has physical access to your computer and root/admin permissions, they can:
1. Read `bluevein.json`
2. Extract Bluetooth keys
3. Connect to your devices

**BUT:** for this they already need administrator permissions on your computer. If they have such access — Bluetooth keys are the least of your problems :)

# How to install?

## Arch Linux

```bash
# Install via AUR
yay -S bluevein-bin

# Start service
sudo systemctl enable --now bluevein

# Check status
sudo systemctl status bluevein
```

## Other Linux distributions

```bash
# Build from source
git clone https://github.com/meowrch/BlueVein.git
cd BlueVein
cargo build --release

# Install
sudo cp target/release/bluevein /usr/local/bin/
sudo cp ./systemd/bluevein.service /etc/systemd/system/

# Start
sudo systemctl daemon-reload
sudo systemctl enable --now bluevein
```

## Windows

```powershell
# Download bluevein.exe from GitHub Releases
# Place file in drive root (or any other reliable location)
# Open PowerShell as administrator

# Install and start
.\bluevein.exe install
.\bluevein.exe start

# Check
Get-Service BlueVeinService
```

# Comparison with alternatives

| Parameter          | BlueVein             | bt-dualboot               | Manual synchronization |
| ------------------ | -------------------- | ------------------------- | ---------------------- |
| Automation         | ✅ Full               | ⚠️ Requires manual launch | ❌ Fully manual       |
| BLE support        | ✅ All keys           | ⚠️ Partial                | ✅ Possible           |
| Multiple adapters  | ✅ Yes                | ❌ No                      | ✅ Yes               |
| Method security    | ✅ Official APIs      | ⚠️ chntpw (hack)          | ⚠️ Error risk         |
| Partition mounting | ✅ Not required       | ❌ Required                | ❌ Required          |
| Support            | ✅ Active development | ❌ Currently abandoned     | N/A                  |

# Conclusion

Three months ago I was spending 2.3 days a year reconnecting Bluetooth devices. It was annoying, distracting, mood-ruining.

Now I switch between Windows and Linux painlessly. No Bluetooth headaches...

**I forgot about the problem. Hope you will too :)**

# Links
- 🔗 **GitHub:** [github.com/meowrch/BlueVein](https://github.com/meowrch/BlueVein)
- 📦 **AUR package:** [bluevein-bin](https://aur.archlinux.org/packages/bluevein-bin)
- 📥 **Releases:** [GitHub Releases](https://github.com/meowrch/BlueVein/releases)
- 🐛 **Issues:** [GitHub Issues](https://github.com/meowrch/BlueVein/issues)