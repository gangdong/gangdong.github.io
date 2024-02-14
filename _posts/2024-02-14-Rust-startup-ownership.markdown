---
layout: post
title:  "Rust startup - Ownership"
date:   2024-02-14 11:20:15 +0800
categories: Rust
tags: Rust
Published: true
excerpt_separator: <!--more-->
toc: true
sidebar: true
language: english
about: true
author: david.dong
description: Learning the concept of ownership.
keywords: Rust

---

Ownership in Rust refers to a set of rules that govern how memory is managed. At any given time, each value in Rust has a variable that is known as its owner. There can be only one owner at a time. When the owner goes out of scope, the value is dropped and its memory is deallocated.   <!--more-->

Ownership ensures that memory is used safely and efficiently, and it prevents common memory errors such as dangling pointers and memory leaks.

### The Ownership Rules

The ownership rules in Rust are as follows:

+ **Every value in Rust has an owner.** The owner is the variable or expression that is last assigned to the value.

+ **There can only be one owner of a value at a time.** When a value is assigned to a new variable, the ownership of the value is transferred to the new variable.

+ **When a value goes out of scope, the value is dropped.** The value is deallocated and its memory is returned to the system.

### The Benefits of Ownership

Ownership provides several benefits for Rust programs, including:

+ **Memory safety:** Ownership prevents common memory errors such as dangling pointers and memory leaks.

+ **Efficiency:** Ownership allows Rust to optimize memory usage by deallocating memory as soon as it is no longer needed.

+ **Expressiveness:** Ownership can be used to express the lifetime of data in Rust programs.

### Ownership and Borrowing

In some cases, it is necessary to allow multiple parts of a program to access the same data. This can be done using borrowing. Borrowing is a way to temporarily transfer ownership of a value to another variable or expression. References (&) are used to borrow values, and they have a limited lifetime during which they are valid.

### Mutable Borrowing

Mutable references (&mut) allow you to borrow a value for both reading and writing.
Only one mutable reference is allowed at a time in a given scope to prevent data races.

### Clone

To create a new value with the same data without transferring ownership, you can explicitly clone the value. Cloning allocates new memory for the data, allowing multiple variables to own separate copies of the same data.

### Ownership in Functions

Function parameters by default take ownership of the passed values.
To borrow a value within a function without taking ownership, you can pass references as function arguments.

### The Ownership Checker

The Rust compiler includes an ownership checker that helps to ensure that the ownership rules are followed. The ownership checker can detect and report errors such as dangling pointers and memory leaks.

### Lifetimes

Lifetimes are annotations that specify the scope for which references are valid.
They are used by the Rust compiler to enforce memory safety rules and prevent dangling references.

Ownership in Rust provides a powerful mechanism for memory management and ensures memory safety without the need for a garbage collector or manual memory management. It enables safe and efficient concurrency and system-level programming in Rust.

### Example

```rust
struct Car {
    name: String,
    price: u32,
}
fn print_car(car: Car)
{
    println!("Name {}, price {}", car.name, car.price);
}
fn main() {

    let demo_car = Car {
        name: String::from("Ferrari"),
        price: 10000,
    };

    print_car(demo_car);
    //println!("Name {}, price {}", demo_car.name, demo_car.price);
}
```

Output

```c
~ cargo run
   Compiling greeting v0.1.0 (/home/david/code/rust/first_proj/greeting)
    Finished dev [unoptimized + debuginfo] target(s) in 0.48s
     Running `target/debug/greeting`
Name Ferrari, price 10000
```

so the ownership of the `demo_car` has been transferred to function `pirnt_car`, try to use the `demo_car` after being transferred. 

```rust
struct Car {
    name: String,
    price: u32,
}
fn print_car(car: Car)
{
    println!("Name {}, price {}", car.name, car.price);
}
fn main() {

    let demo_car = Car {
        name: String::from("Ferrari"),
        price: 10000,
    };

    print_car(demo_car);
    println!("Name {}, price {}", demo_car.name, demo_car.price);
}
```

as expected, a compile error occurred. The error encountered is due to the `demo_car` variable being moved when it's passed to the `print_car` function. After the move, I am trying to use `demo_car` again in the `println!` macro, which is not allowed because ownership has already been transferred.

```c
~ cargo run
   Compiling greeting v0.1.0 (/home/david/code/rust/first_proj/greeting)
error[E0382]: borrow of moved value: `demo_car`
  --> src/main.rs:17:50
   |
11 |     let demo_car = Car {
   |         -------- move occurs because `demo_car` has type `Car`, which does not implement the `Copy` trait
...
16 |     print_car(demo_car);
   |               -------- value moved here
17 |     println!("Name {}, price {}", demo_car.name, demo_car.price);
   |                                                  ^^^^^^^^^^^^^^ value borrowed here after move
   |
note: consider changing this parameter type in function `print_car` to borrow instead if owning the value isn't necessary
  --> src/main.rs:5:19
   |
5  | fn print_car(car: Car)
   |    ---------      ^^^ this parameter takes ownership of the value
   |    |
   |    in this function
```

To fix this, we can either clone the `demo_car` before passing it to `print_car`, or we can change the `print_car` function to accept a reference to Car rather than taking ownership of it. Here's the modified code using the second approach:

```rust
#[derive(Clone)]
struct Car {
    name: String,
    price: u32,
}
fn print_car(car: Car)
{
    println!("Name {}, price {}", car.name, car.price);
}
fn main() {

    let demo_car = Car {
        name: String::from("Ferrari"),
        price: 10000,
    };

    print_car(demo_car.clone());
    println!("Name {}, price {}", demo_car.name, demo_car.price);
}
```

Output

```c
~ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.05s
     Running `target/debug/greeting`
Name Ferrari, price 10000
Name Ferrari, price 10000
```

Above we clone `demo_car` before passing it to the `print_car` function.

In this version:

+ We've added `#[derive(Clone)]` to the Car struct definition to automatically derive the Clone trait for Car, allowing us to call the clone method on instances of Car.

+ When calling `print_car`, we pass a cloned copy of `demo_car` using `demo_car.clone()`. This creates a new copy of `demo_car`, and ownership of the copy is passed to the `print_car` function, allowing us to retain ownership of the original `demo_car`.

+ After calling `print_car`, we can still use `demo_car` as it has not been moved.

Below is another approach 

```rust
struct Car {
    name: String,
    price: u32,
}
fn print_car(car: &Car)
{
    println!("Name {}, price {}", car.name, car.price);
}
fn main() {

    let demo_car = Car {
        name: String::from("Ferrari"),
        price: 10000,
    };

    print_car(&demo_car);
    println!("Name {}, price {}", demo_car.name, demo_car.price);
}
```

Output

```c
~ cargo run
   Compiling greeting v0.1.0 (/home/david/code/rust/first_proj/greeting)
    Finished dev [unoptimized + debuginfo] target(s) in 0.35s
     Running `target/debug/greeting`
Name Ferrari, price 10000
Name Ferrari, price 10000
```

In this version:

+ The `print_car` function now accepts a reference to a Car struct using `&Car` as the parameter type.

+ Inside `print_car`, we use car.name and car.price to access the fields of the Car struct via the reference.

+ When calling `print_car`, we pass a reference to `demo_car` using `&demo_car`, which allows us to borrow demo_car without transferring ownership.

+ After calling `print_car`, we can still use `demo_car` as it has not been moved.
