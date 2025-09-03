---
created: 2025-08-13T02:35
updated: '2025-08-30T04:04:22.000Z'
published: null
title: Papers, Please
subTitle: You Shall Not Pass.
description: About Cookies, Sessions, and Token Authentication Systems
series: papers-please-the-authentication
categories:
  - Thoughts
tags: null
lang: en
thumbnail: ''
originalLang: ko
---
### Welcome to Arstotzka

In 2013, an indie game invited gamers worldwide to a fictional border checkpoint. Papers, Please — players become border inspectors of the virtual country Arstotzka, spending their day checking passports, verifying documents, and stamping entry permits.

Why did this seemingly mundane game gain such popularity? Because of its unique concept, immersive atmosphere, and above all, a system that constantly presents players with **ethical dilemmas**. Follow the rules, and your family might starve; show mercy, and terrorists might slip through. With daily changing entry regulations, increasingly sophisticated forged documents, and pleas of “Please just this once,” players must continuously make judgments and bear the consequences.

### Backend Developers, Border Inspectors of the Digital World
> “What a strict border this is, working diligently looks good on you. **Come back with your entry papers**” – Jorji Costava  
> *From the game Papers, Please*

Wait, this situation feels familiar.

`POST /api/login`
```json
{
  "username": "jorji_costava",
  "password": "cobrastan_best"
}
```

The daily life of a backend developer isn’t much different. Every moment, from dozens to thousands or even tens of thousands of HTTP requests line up at our API gateway. Each request claims to be from a legitimate user wanting access to our service.

- Is this request really from a genuine user, or is it a bot?  
- Is this token valid? Has it expired?  
- Does this user have permission to access this resource?  
- Didn’t we get the exact same request just 5 seconds ago... is this a brute force attack?

Just as the Papers, Please inspector checks passport expiration dates, compares photos to the person, and reviews entry purposes, we perform document inspections called Authentication and Authorization on every request.

### Increasingly Complex Entry Regulations

The entry rules in Arstotzka grow more complicated day by day. What started as “Check passports only” evolves into “Coldechian citizens need entry permits, Impor natives require additional identity checks, and all foreigners must submit vaccination certificates.”

The same goes for real-world web services. What began as simple ID/password checks now includes two-factor authentication (2FA), OAuth social logins, biometric authentication, device fingerprinting, location-based access control, rate limiting... **The ever-growing inspection procedures, driven by new standards, attack methods, and domains, seem endless. They will likely only increase, never decrease.** ~~What about legacy systems if we just remove them? Legacy systems!~~

### Three Core Inspection Tools

Today, we won’t cover special inspection techniques like rate limiting or biometrics. Instead, we’ll dive deep into the **three fundamental and essential identity verification methods every backend developer must know** — sessions, cookies, and tokens. They are like passports, entry permits, and passes in the digital world, just like in Papers, Please.  
The ever-growing inspection procedures, driven by new standards, attack methods, and domains, seem endless and will likely only increase, not decrease.

### The Three Inspection Methods We Face



**Session** – The checkpoint’s way of remembering everything  
**Cookie** – Issuing visitors a temporary pass  
**Token (JWT)** – Using a tamper-proof smart passport

Each method has its own pros and cons and should be chosen appropriately depending on the situation. Much like balancing rules and mercy in Papers, Please.

Now, let’s take a seat at the checkpoint booth.  
> _“Next!”_