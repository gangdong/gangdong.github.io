---
layout: post
title:  "Rust startup - environment setup"
date:   2024-02-10 17:24:55 +0800
categories: Rust
tags: Rust
Published: true
excerpt_separator: <!--more-->
toc: true
sidebar: true
language: english
about: true
author: david.dong
description: To record how to build up dev environment of rust .
keywords: Rust

---

Rust is hot, I've heard a lot of people talking about the Rust language, and it's powered me enough to learn more about it!   <!--more-->

This is the first note to document the process of setting up the development environment, mainly choosing to develop under Linux. 

## Environments

- OS - ubuntu 16.04
- C Compiler - x86_64-unknown-linux-gnu
- IDE - VS Code

## Setup

### Rust Compile environment and related tools installation

The rust development environment consists of rustup (toolchain management tool), cargo (package manager and build system) and rustc (compiler).

```c
$ export RUSTUP_DIST_SERVER=https://mirrors.ustc.edu.cn/rust-static
$ export RUSTUP_UPDATE_ROOT=https://mirrors.ustc.edu.cn/rust-static/rustup
$ sudo curl https://sh.rustup.rs -sSf | sh
```

choose option 1

```c
& david @ david-VirtualBox in ~ 0 [15:51:08]
~ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh                                                                 0 [15:51:08]
info: downloading installer

Welcome to Rust!

This will download and install the official compiler for the Rust
programming language, and its package manager, Cargo.

Rustup metadata and toolchains will be installed into the Rustup
home directory, located at:

  /home/david/.rustup

This can be modified with the RUSTUP_HOME environment variable.

The Cargo home directory is located at:

  /home/david/.cargo

This can be modified with the CARGO_HOME environment variable.

The cargo, rustc, rustup and other commands will be added to
Cargo's bin directory, located at:  /home/david/.cargo/binThis path will then be added to your PATH environment variable bymodifying the profile files located at:  /home/david/.profile  /home/david/.bashrcYou can uninstall at any time with rustup self uninstall andthese changes will be reverted.Current installation options:   default host triple: x86_64-unknown-linux-gnu     default toolchain: stable (default)               profile: default  modify PATH variable: yes1) Proceed with installation (default)2) Customize installation3) Cancel installation>1info: profile set to 'default'info: default host triple is x86_64-unknown-linux-gnuinfo: syncing channel updates for 'stable-x86_64-unknown-linux-gnu'712.1 KiB / 712.1 KiB (100 %)  78.6 KiB/s in  7s ETA:  0sinfo: latest update on 2024-02-08, rust version 1.76.0 (07dca489a 2024-02-04)info: downloading component 'cargo'  8.5 MiB /   8.5 MiB (100 %)  80.0 KiB/s in  1m 44s ETA:  0sinfo: downloading component 'clippy'  2.1 MiB /   2.1 MiB (100 %)  95.0 KiB/s in 23s ETA:  0sinfo: downloading component 'rust-docs' 14.7 MiB /  14.7 MiB (100 %) 117.4 KiB/s in  2m 45s ETA:  0s    info: downloading component 'rust-std' 23.9 MiB /  23.9 MiB (100 %)  98.2 KiB/s in  4m 21s ETA:  0s    info: downloading component 'rustc' 62.3 MiB /  62.3 MiB (100 %) 135.4 KiB/s in 12m 15s ETA:  0s    info: downloading component 'rustfmt'  2.3 MiB /   2.3 MiB (100 %)  86.2 KiB/s in 30s ETA:  0s info: installing component 'cargo'info: installing component 'clippy'info: installing component 'rust-docs' 14.7 MiB /  14.7 MiB (100 %)   5.0 MiB/s in  2s ETA:  0sinfo: installing component 'rust-std' 23.9 MiB /  23.9 MiB (100 %)  13.2 MiB/s in  1s ETA:  0sinfo: installing component 'rustc' 62.3 MiB /  62.3 MiB (100 %)  14.9 MiB/s in  4s ETA:  0sinfo: installing component 'rustfmt'info: default toolchain set to 'stable-x86_64-unknown-linux-gnu'  stable-x86_64-unknown-linux-gnu installed - rustc 1.76.0 (07dca489a 2024-02-04)Rust is installed now. Great!To get started you may need to restart your current shell.This would reload your PATH environment variable to includeCargo's bin directory ($HOME/.cargo/bin).

To configure your current shell, run:
source "$HOME/.cargo/env"

& david @ david-VirtualBox in ~ 0 [16:20:53]
```

- The Rustup metadata and toolchain will be installed in the Rustup home directory located at /home/david/.rustup, which can be modified using the RUSTUP_HOME environment variable. 

- Cargo's home directory is located at /home/david/.cargo which can be modified via the CARGO_HOME environment variable.

- cargo, rustc, rustup and other commands will be added to cargo's bin directory, which is located in /home/david/.cargo/bin 

- add this path to the PATH environment variable /home/david/.profile or /home/david/. bashrc
  
  ```shell
  export PATH="$HOME/.cargo/bin:$PATH
  ```
+ I used fish shell, so need to add environment variable PATH in ~/.config/fish/config.fish
  
  ```shell
  set -x PATH ~/.cargo/bin $PATH
  ```

+ Verify the installation
  
  ```c
  > rustc -V
  rustc 1.76.0 (07dca489a 2024-02-04)
  > cargo -V
  cargo 1.76.0 (c84b36747 2024-01-18)
  > rustup -V
  rustup 1.26.0 (5af9b9484 2023-04-05)
  info: This is the version for the rustup toolchain manager, not the rustc compiler.
  info: The currently active `rustc` version is `rustc 1.76.0 (07dca489a 2024-02-04)`
  ```

The rust toolchain management tool rustup, the package manager cargo, and the compiler rustc are now installed!

- unstallation command
  
  ```c
  rustup self uninstall
  ```

### VSCODE configuration development Rust

Install the following plug-ins

- rust-analyzer
- CodeLLDB
- Code Runner

### Vscode debugging Rust code

- Create a project directory like first_prj 

- Go to first_prj 

- Run `cargo new first_prj_name` in terminal, it will create project first_prj_name directory and src/main. rs 
  
  ```c
  Welcome to fish, the friendly interactive shell
  Type help for instructions on how to use fish
  
  & david @ ubuntu in ~/code/rust/first_proj 0 [19:06:14]
  ~ cargo new greeting
       Created binary (application) `greeting` package
  ```

- cd . /first_prj_name

- run `cargo build` to compile the code 
  
  ```cs
  & david @ ubuntu in ~/code/rust/first_proj/greeting (master …3) 0 [19:07:15]
  ~ cargo build
     Compiling greeting v0.1.0 (/home/david/code/rust/first_proj/greeting)
      Finished dev [unoptimized + debuginfo] target(s) in 0.18s 0.
  ```

- run `cargo run` to debug the code

```c
& david @ ubuntu in ~/code/rust/first_proj/greeting (master …4) 0 [19:07:19]
~ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.00s
     Running `target/debug/greeting`
Hello, world!
```
