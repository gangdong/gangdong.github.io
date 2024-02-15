---
layout: post
title:  "Rust startup - trait"
date:   2024-02-15 11:22:40 +0800
categories: Rust
tags: Rust
Published: true
excerpt_separator: <!--more-->
toc: true
sidebar: true
language: english
about: true
author: david.dong
description: Is Rust an object-oriented programming language?
keywords: Rust

---

Is Rust an object-oriented programming language? I searched for the answer to this question on different AI assistants. <!--more-->

Below are the answers. Let's see.

> `CHATGPT 3.5`
> 
> While Rust supports some object-oriented programming (OOP) concepts, it is not strictly
> classified as an object-oriented programming language. Rust is more commonly categorized
> as a multi-paradigm programming language, combining features from OOP, functional programming, 
> and other paradigms.

And

> `Copilot`
> 
> + Rust is **not** strictly an object-oriented programming language.
> 
> + However, it shares some features with OOP, making it a fascinating blend of paradigms.

And

> `Gemini`
> 
> The question of whether Rust is an object-oriented programming language (OOP) has a nuanced answer. While it **shares some features with OOP languages, it ultimately has a different paradigm.**
> So, is Rust OOP?
> 
> + **From a strict definition:** Technically no, Rust's core design philosophy differs from traditional OOP.
> 
> + **In practice:** It borrows certain OOP concepts and tools, offering a familiar feel for OOP programmers.
> 
> + **More accurately:** Rust uses a multi-paradigm approach, incorporating elements of OOP, functional programming, and others.

So the next question is how the Rust achieves polymorphism. The answer is using **traits**.

In Rust, we can define data structures using structs and enums, and achieve polymorphism using **traits** and trait objects, which share some similarities with classes and interfaces in OOP. However, Rust **does not have** classes or inheritance as found in traditional OOP languages. Instead, Rust emphasizes ownership, lifetimes, and abstraction through traits and generics.

Below is an example of how to use traits.

trait allows developers to define shared behavior that can be implemented by different types. They serve as a way to express interfaces or contracts that types must adhere to. 

```rust
trait Animal {
    fn speak(&self);
}

struct Dog {
    name: String,
    age: u32,
}

impl Animal for Dog {
    fn speak(&self) {
        println!("Woof!");
    }
}

struct Cat {
    name: String,
    age: u32,
}

impl Animal for Cat {
    fn speak(&self) {
        println!("Meow!");
    }
}

fn do_speak(animal : &dyn Animal){
    animal.speak();
}

fn main() {

    let dog = Dog {name: String::from("kaka"), age: 10};
    let cat = Cat {name: String::from("haha"), age:5};

    println!("{} is {} years old", dog.name, dog.age);
    println!("{} is {} years old", cat.name, cat.age);

    dog.speak();
    cat.speak();

    do_speak(&dog);
    do_speak(&cat);
}
```

Output 

```c
kaka is 10 years old
haha is 5 years old
Woof!
Meow!
Woof!
Meow!
```
