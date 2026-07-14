# HYBRID Installer

## Status
Approved for product development.

## Purpose
HYBRID Installer is the official installation, recovery, migration and lifecycle management application for the HYBRID Home Assistant ecosystem.

## Product principles
- Premium from Day One
- AI-assisted setup
- Local-first operation
- Safe defaults
- Reversible operations
- Clear progress and diagnostics
- One consistent experience across Windows, macOS and Linux

## Genesis distribution profiles

### HHA Container Edition
Target: developers, integrators and homelab users.

Deliverables:
- Docker Compose profile
- amd64 and arm64 container images
- environment validation
- health checks
- upgrade and rollback instructions

### HHA Appliance Edition
Target: Proxmox, VMware, VirtualBox and Hyper-V.

Formats:
- OVA/OVF
- QCOW2
- VMDK
- VHDX

Deliverables:
- preconfigured virtual appliance
- first-boot wizard
- automatic network discovery
- versioned image manifest

### HHA Edge Edition
Target: Raspberry Pi 4, Raspberry Pi 5 and compatible ARM64 devices.

Deliverables:
- signed ARM64 image
- SSD and SD-card support
- hardware compatibility manifest
- first-boot provisioning
- automatic HHA discovery

## Core capabilities

### Install
- choose target platform
- download the correct signed release
- verify checksum and signature
- write or deploy the image
- monitor first boot
- discover the installation on the local network

### Connect
- locate existing HHA installations
- show address, version and House Health
- open administration securely

### Universal Backup
The portable backup package will use the `.hybridhome` extension and may include:
- database
- homes, rooms and residents
- devices and integrations
- dashboards
- automations and scenes
- AI settings and approved memories
- apps, themes and agents
- certificates and encrypted secrets

Secrets must be encrypted and the package must include a versioned manifest.

### Recovery
- restore backup
- repair database
- validate filesystem
- update or roll back
- restart services
- safe mode
- export diagnostics

### Migration Wizard
Initial source: Home Assistant.

Migration stages:
1. analyze source installation
2. produce compatibility report
3. import areas and entities
4. map devices to the Universal Capability Model
5. convert supported automations
6. preserve unsupported items in a review report
7. validate before activation

## HHA Image Builder
A common build pipeline must generate all official editions from the same versioned source and release manifest.

Required outputs:
- container images
- virtual appliance images
- ARM64 images
- checksums
- signatures
- software bill of materials
- release metadata

## HHA Supervisor
The Supervisor will manage appliance and edge installations.

Responsibilities:
- lifecycle of HHA services
- updates and rollback
- backups and restore
- health monitoring
- storage and network diagnostics
- recovery mode
- signed app installation

The Supervisor is optional for Container Edition and mandatory for managed appliance editions.

## Roadmap

### Genesis
- Container Edition
- Appliance Edition
- Edge Edition
- common release manifest

### Aurora
- HYBRID Installer desktop application
- Universal Backup
- Recovery Mode
- HHA Supervisor

### Horizon
- Home Assistant Migration Wizard
- cloud-assisted remote management, optional
- enterprise deployment profiles

## Security requirements
- signed images and manifests
- checksum verification before writing
- no telemetry without consent
- encrypted secrets at rest
- explicit confirmation for destructive actions
- recovery operations must be auditable
