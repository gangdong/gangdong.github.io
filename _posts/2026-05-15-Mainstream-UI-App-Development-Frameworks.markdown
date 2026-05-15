---
layout: post
title:  "Mainstream UI App Development Frameworks in 2026 — A Learning Summary"
date:   2026-05-15 16:00:00 +0800
categories: crossplatform
tags: UI开发框架
Published: true
excerpt_separator: <!--more-->
toc: true
sidebar: true
language: english
about: true
author: david.dong
description: A comprehensive analysis of mainstream cross-platform UI development frameworks including Flutter, React Native, KMP, Tauri, Electron, Qt, .NET MAUI, Unity, and more. Covers architecture, performance, ecosystem, and selection guidance.
keywords: cross-platform, UI framework, Flutter, React Native, Tauri, Electron, KMP, Qt

---

Over the past decade, the landscape of UI application development has undergone a dramatic transformation. The days when building an app for iOS, Android, Windows, and macOS meant maintaining four separate codebases are fading fast. Today, developers have an overwhelming number of cross-platform frameworks to choose from — each with its own philosophy, trade-offs, and ideal use cases. After studying this topic in depth, here is what I have learned and my personal take on where things stand in 2026.<!--more-->

## Why Cross-Platform Matters More Than Ever

The demand for cross-platform development is no longer just about "write once, run anywhere." In 2026, the key drivers are:

- **Cost efficiency**: maintaining a single codebase for multiple platforms dramatically reduces engineering headcount
- **Time to market**: cross-platform frameworks allow teams to ship to iOS, Android, and desktop simultaneously
- **Consistent brand experience**: users expect the same look and feel across devices
- **Talent availability**: frameworks leveraging popular languages (JS/TS, Dart, Kotlin) tap into larger developer pools

But there is no free lunch. Every framework makes trade-offs. Let me walk through the major players, what I found impressive, and where each falls short.

---

## Framework Overview

Before diving into details, here is a bird's-eye view of the frameworks covered in this article:

| Framework | Language | Platforms | Bundle |
|-----------|----------|-----------|--------|
| **Flutter** | Dart | iOS/Android/Web/Desktop | 15-50 MB |
| **React Native** | JS/TS | iOS/Android/Web | 10-30 MB |
| **KMP** | Kotlin | iOS/Android/Desktop/Web | ~2 MB |
| **Tauri** | Rust+JS | Win/Mac/Linux | 3-10 MB |
| **Electron** | JS/CSS | Win/Mac/Linux | 100-300 MB |
| **Qt** | C++/Python | Win/Mac/Linux/Embed | 20-70 MB |
| **.NET MAUI** | C# | iOS/Android/Win/Mac | 20-40 MB |
| **Unity** | C# | Mobile/Desktop/Console | 20-200 MB |

---

## Deep Dive: Each Framework Analyzed

### 1. Flutter — The Cross-Platform Consistency King

Flutter is arguably the most ambitious cross-platform framework today. Instead of translating your UI code into native widgets, it draws every pixel itself using the Skia (now Impeller) graphics engine.

**What impressed me:**
- The UI consistency is unmatched. A Flutter app running on Android, iOS, Windows, and macOS looks virtually identical at the pixel level
- Performance is genuinely near-native for most use cases. The 60/120fps claim holds up in practice thanks to AOT compilation to native ARM/x64 machine code
- Hot reload is a game-changer for developer productivity — I have seen teams iterate at speeds that feel almost like web development
- The widget system is well-designed. "Everything is a widget" is not just a slogan; it genuinely simplifies composability

**The not-so-good:**
- Dart, while a well-designed language, remains relatively niche. Finding experienced Dart developers is harder than JS or Kotlin
- The bundle size floor is around 8-10 MB minimum, which can feel heavy for a simple app
- Platform channels for native bridging add complexity. Every time you need platform-specific functionality, you write Dart code + native code + maintain the bridge
- Flutter Web performance still lags behind React or Vue for complex content-heavy pages

**Notable apps**: Alibaba Xianyu, Google Ads, BMW App, ByteDance products (partial), Nubank

**My take**: Flutter is the strongest choice when UI consistency across platforms is your top priority, especially for consumer-facing apps with rich animations and custom designs.

---

### 2. React Native — The Web Developer's Gateway to Mobile

React Native brings the React paradigm to mobile development. Instead of rendering DOM elements, it maps React components to native platform widgets through a JavaScript bridge.

**What impressed me:**
- The developer experience is excellent for anyone with React experience — and there are a lot of React developers
- The community ecosystem is the largest of any cross-platform framework. NPM has a package for virtually everything
- Hot reload and Fast Refresh make iteration fast
- OTA updates via CodePush or Expo Updates allow pushing fixes without going through app store review — a huge operational advantage

**The not-so-good:**
- The JavaScript bridge introduces unavoidable communication overhead. Complex lists and animations can exhibit noticeable jank
- UI consistency suffers because components map to different native widgets on each platform. A `Picker` on iOS looks different from one on Android, and custom styling only gets you so far
- Debugging bridge-layer issues is genuinely painful — crashes that originate in the native side from a JS call stack are hard to trace
- Large projects tend to accumulate messy state management and the project structure degrades over time without discipline

**Notable apps**: Facebook, Instagram, Shopify, Discord, Uber Eats, Pinterest

**My take**: React Native is ideal for web-first teams building mobile apps without dedicated native engineers. For straightforward CRUD apps and content-focused experiences, it delivers fast time-to-market.

---

### 3. Kotlin Multiplatform (KMP) — The Pragmatic Choice for Native Teams

KMP takes a different approach from Flutter or React Native. Instead of trying to share UI code, it focuses on sharing business logic while keeping the UI native on each platform.

**What impressed me:**
- Zero bridge overhead — shared code compiles down to native binaries on each platform
- It integrates into existing native projects seamlessly. You do not need to rewrite your app; you just start adding shared modules
- Business logic sharing is genuinely high — networking, data storage, validation, algorithms — 100% of this code can be shared
- Backed by JetBrains, so it has strong tooling (although Gradle build is still slow)

**The not-so-good:**
- You still need to write and maintain two UIs (SwiftUI for iOS, Jetpack Compose for Android). This is a significant amount of work
- The learning curve is steep if you are not already familiar with Kotlin and the KMP build system
- Gradle configuration is complex and compilation is slow — this impacts iteration velocity
- The ecosystem is relatively young. Third-party library support, while growing, is nowhere near Flutter or React Native levels

**Notable apps**: Netflix, Cash App, JetBrains Space, McDonalds (partial)

**My take**: KMP is the best choice for teams that already have native iOS and Android apps and want to reduce duplication in business logic. It is not a "cross-platform UI framework" — it is a "cross-platform logic framework."

---

### 4. Tauri — The Lightweight Challenger to Electron

Tauri represents a fundamental rethinking of desktop app development. Instead of bundling a browser engine, it leverages the OS-native WebView and pairs it with a Rust backend.

**What impressed me:**
- The bundle size difference is staggering. While Electron apps routinely exceed 100 MB, a Tauri app can be as small as 3 MB
- Memory usage is 50-70% lower than equivalent Electron apps
- Startup time is typically under 1 second
- Rust provides genuine memory safety guarantees without garbage collection overhead
- You can use any web framework (React, Vue, Svelte) as your frontend

**The not-so-good:**
- Mobile support is still in development. If you need iOS/Android, Tauri is not ready yet
- The ecosystem is young. Documentation, community plugins, and best practices are still maturing
- OS-level features (file system, system tray, notifications) require writing Rust wrappers — the API surface is not as rich as Electron's
- WebView behavior varies across platforms. Linux WebKit, macOS WebKit, and Windows WebView2 all have subtle differences that can cause UI issues

**Notable apps**: AppFlowy, Figma Desktop (partial), various open-source tools

**My take**: Tauri is the framework I am most excited about for desktop applications. Its lightweight philosophy is the right direction, and as the ecosystem matures, I expect it to become the default choice for new desktop app projects by 2027-2028.

---

### 5. Electron — The Battle-Tested Veteran

Electron packages a full Chromium browser with Node.js to build desktop applications using web technologies. It is the most mature cross-platform desktop framework by a wide margin.

**What impressed me:**
- The ecosystem is unmatched. Need to interact with the file system? Node.js has a library. Need to integrate with a native API? There is probably an Electron plugin
- Cross-platform compatibility is genuinely excellent. An Electron app on Windows, macOS, and Linux behaves almost identically
- For frontend developers, the learning curve is essentially zero. You are building a web app
- Debugging is straightforward — you can use standard Chrome DevTools

**The not-so-good:**
- Resource usage is genuinely problematic. 100-300 MB for a "Hello World" app is hard to defend in 2026
- Cold start time of 3-5 seconds feels sluggish compared to native or Tauri
- Memory consumption of 200-500 MB at runtime is not uncommon
- Security surface area is enormous — you are bundling a full browser engine, which means all Chromium and Node.js CVEs are applicable

**Notable apps**: VS Code, Slack, Discord, Figma, Notion, WhatsApp Desktop, Postman

**My take**: Electron is still the right choice for complex desktop tools where ecosystem richness outweighs resource concerns. VS Code proves that an Electron app can feel native with enough engineering polish. But for simple tools? Tauri is now a better option.

---

### 6. Qt — The Industrial Standard

Qt has been the gold standard for cross-platform native applications since the 1990s. It uses a platform abstraction layer (QPA) to map its widgets to native APIs on each operating system.

**What impressed me:**
- Performance is native — because it *is* native. Qt widgets render through the OS's native 2D API (GDI on Windows, Core Graphics on macOS)
- The platform abstraction layer (QPA) is brilliantly designed — Qt applications genuinely feel at home on each platform
- Embedded systems support is unmatched. Qt runs on everything from industrial displays to automotive dashboards
- Qt Quick/QML provides a modern, GPU-accelerated path that can compete with Flutter

**The not-so-good:**
- C++ is unforgiving. Memory management and build complexity are real productivity drains
- Licensing is complex — Qt requires commercial licensing for proprietary applications, which is expensive
- The UI, while native, looks dated by default. Achieving modern aesthetics requires significant customization
- The learning curve is steep for developers not already familiar with C++

**Notable apps**: Autodesk Maya, VirtualBox, VLC, OBS Studio, Wireshark, Telegram Desktop, KDE

**My take**: Qt is irreplaceable in industrial and embedded contexts. If you are building a medical device interface, an automotive dashboard, or professional creative software, Qt is still the answer. For consumer apps? The cost and complexity are harder to justify.

---

### 7. .NET MAUI — The Enterprise Contender

.NET MAUI is Microsoft's evolution of Xamarin.Forms, aiming to provide a single project structure for iOS, Android, Windows, and macOS.

**What impressed me:**
- Deep Visual Studio integration for debugging, profiling, and packaging
- MVVM architecture support built-in — enterprise developers feel right at home
- Covers all platforms Microsoft cares about, with good Windows support

**The not-so-good:**
- macOS and iOS support feels like an afterthought — incomplete feature adaptation and poor debugging experience
- The community is small compared to Flutter or React Native. Finding third-party libraries is harder
- Cold start speed is slower than Flutter and native apps
- You need to understand .NET ecosystem plus platform-native specifics — the knowledge requirements are broad

**Notable apps**: Microsoft enterprise products, internal line-of-business applications

**My take**: .NET MAUI is a viable choice for enterprises already invested in the Microsoft ecosystem building internal tools. For consumer-grade cross-platform apps, I would look at Flutter or KMP first.

---

### 8. Unity — Beyond Gaming

Unity deserves mention not because it is a traditional UI framework, but because it powers a massive number of applications that blend UI with 2D/3D graphics.

**What impressed me:**
- The 2D/3D rendering capabilities are best-in-class. Particle systems, physics, AR/VR — Unity handles it all
- Asset Store provides a massive library of pre-built components, reducing development time
- Multi-platform coverage extends beyond mobile and desktop to consoles (PlayStation, Xbox, Switch) and WebGL

**The not-so-good:**
- It is fundamentally a game engine, not a UI framework. Building a standard form-based app in Unity is overkill and inefficient
- Bundle size starts at 20 MB and quickly balloons with assets
- Development workflow is optimized for games — the scene-based editor and component system feel awkward for traditional app development
- Memory and CPU overhead are significant even for simple applications

**Notable apps**: Honor of Kings, Pokemon Go, Genshin Impact, various AR/VR experiences

**My take**: Unity is the right choice for games, AR/VR, and interactive 3D experiences. Do not use it for a standard CRUD application — you will regret it.

---

### China-Specific Frameworks Worth Knowing

No cross-platform analysis in 2026 would be complete without mentioning the vibrant ecosystem in China, where homegrown frameworks have gained significant traction:

| Framework | Company | Key Strength | Notable Apps |
|-----------|---------|-------------|--------------|
| **Kuikly** | Tencent | KMP-based, native-level performance, HarmonyOS support | QQ Music, Tencent News, WeSing, 20+ Tencent products |
| **uni-app X** | DCloud | Vue syntax, deep mini-program support | JD.com, DiDi, Kuaishou (partial) |
| **Lynx** | ByteDance | Low-code, visual building, non-developer friendly | Douyin internal operations |

Kuikly deserves special attention because it has been validated at massive scale — over 1000 pages and 500M+ DAU across Tencent's product portfolio. The key advantage is that Kuikly leverages Kotlin Multiplatform under the hood, achieving 90%+ code sharing while producing native binaries. Its deep HarmonyOS support is particularly strategic given China's push for domestic OS adoption.

---

## Framework Comparison Matrix

### Performance & Technical

| Framework | Runtime Performance | Startup Time | GPU Acceleration | Memory Efficiency |
|-----------|:------------------:|:------------:|:----------------:|:-----------------:|
| Flutter | ★★★★☆ | Fast | Native (Skia) | ★★★★☆ |
| React Native | ★★★☆☆ | Medium | Via native bridge | ★★★☆☆ |
| KMP | ★★★★★ | Fastest | Native | ★★★★★ |
| Tauri | ★★★★☆ | Fastest | Via WebView | ★★★★★ |
| Electron | ★★☆☆☆ | Slow | Via Chromium | ★★☆☆☆ |
| Qt (C++) | ★★★★★ | Fastest | Native / GL | ★★★★☆ |
| .NET MAUI | ★★★☆☆ | Medium | Native | ★★★☆☆ |
| Unity | ★★★★★ | Slow | Custom engine | ★★☆☆☆ |

### Developer Experience & Ecosystem

| Framework | Learning Curve | Community Size | Job Market | Library Ecosystem |
|-----------|:-------------:|:--------------:|:----------:|:-----------------:|
| Flutter | Medium | Large (growing) | Growing fast | Rich |
| React Native | Low | Largest | Largest | Richest |
| KMP | High | Medium (growing) | Niche | Growing |
| Tauri | Medium (Rust) | Medium (growing) | Niche | Small |
| Electron | Low | Largest | Stable | Richest |
| Qt | High (C++) | Mature | Stable | Mature |
| .NET MAUI | Medium | Small | Niche | Limited |
| Unity | High (C# + 3D) | Large (gaming) | Gaming-focused | Rich (gaming) |

### Bundle Size Comparison

```
Electron : ██████████████████████████████████████████████████ (100-300 MB)
Unity    : ████████████                                       (20-200 MB)
Flutter  : ████████                                           (15-50 MB)
Qt       : ████████████                                       (20-70 MB)
.NET MAUI: █████████                                           (20-40 MB)
React Native: ██████                                         (10-30 MB)
Tauri    : ██                                                  (3-10 MB)
KMP      : █                                                   (~2 MB logic)
```

---

## Scenario-Based Selection Guide

After studying all these options, here is my practical decision framework:

| Your Situation | Best Choice | Why |
|---------------|-------------|-----|
| Consumer mobile app with rich UI | **Flutter** | Unmatched UI consistency, great animation support |
| Web-first team, need mobile ASAP | **React Native** | Huge dev pool, fast iteration, OTA updates |
| Existing native app, share logic | **KMP** | Zero bridge overhead, incrementally adoptable |
| Lightweight desktop tool | **Tauri** | Tiny bundle, low memory, fast startup |
| Complex desktop tool (IDE, design tool) | **Electron** | Mature ecosystem, proven at scale |
| Industrial/embedded software | **Qt** | Native performance, unmatched platform support |
| Enterprise .NET shop, internal tools | **.NET MAUI** | VS integration, Azure ecosystem |
| Game / AR / VR / interactive 3D | **Unity** | Best-in-class 2D/3D rendering |
| China market + multi-mini-program | **uni-app X** | Deep WeChat/Alipay miniprogram integration |
| Large-scale Chinese app, HarmonyOS target | **Kuikly** | Proven at Tencent scale, HarmonyOS support |

---

## Personal Reflections

### What I Learned

**1. There is no "best" framework — only "best for your context."**
Every framework exists because it solves a specific set of problems. Flutter is amazing for UI consistency, but that comes at the cost of Dart adoption and bundle size. Tauri is incredibly lightweight, but you pay in ecosystem maturity. Understanding your constraints — team skills, target platforms, performance requirements, timeline — is the most important skill in framework selection.

**2. The industry is converging on lighter, faster frameworks.**
The Electron era of "just bundle a browser" is giving way to a more thoughtful approach. Tauri, Flutter Desktop, and even improved React Native with the new architecture (JSI instead of bridge) all point in the same direction: smaller bundles, faster startup, lower memory. This trend will only accelerate.

**3. Cross-platform is not just about code sharing.**
The hardest part of building multi-platform apps is not writing the code — it is handling platform-specific behaviors, testing across devices, and maintaining the app over time. KMP's approach of sharing logic while keeping native UI has real merit here.

**4. China's cross-platform ecosystem is ahead in some ways.**
Kuikly's deep integration with KMP and HarmonyOS, uni-app's seamless miniprogram support, and Lynx's low-code approach represent real innovations that the global ecosystem is only starting to catch up with.

**5. AI is changing the calculus.**
With AI-assisted development tools in 2026, maintaining multiple codebases is less painful than it used to be. This weakens the case for cross-platform frameworks in some scenarios — if AI can generate and update your SwiftUI and Jetpack Compose code from a single description, do you still need a cross-platform runtime?

---

## Conclusion

The cross-platform framework landscape in 2026 is rich, diverse, and evolving rapidly. My personal recommendation:

- **For mobile-first consumer apps**: Flutter is the safe bet today
- **For desktop tools**: Tauri deserves serious evaluation — it is ready for production
- **For team with no time to learn**: React Native remains the pragmatic choice
- **For industrial/embedded**: Qt remains the only serious option
- **For native teams wanting less duplicate work**: KMP is the unsung hero

The most important lesson? Do not treat framework selection as a religious debate. Evaluate honestly against your specific context, prototype with two candidates, and make a data-driven decision. The right framework can multiply your team's output; the wrong one can become a drag that lasts for years.

---

*Originally published on [David Dong's Blog](https://dqdongg.com). This article is a learning summary based on research and study of various cross-platform frameworks.*
