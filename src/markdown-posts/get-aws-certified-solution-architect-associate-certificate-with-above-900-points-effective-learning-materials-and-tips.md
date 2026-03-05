---
title: "Get AWS Certified Solution Architect - Associate certificate with above 900 points: Effective learning materials and tips"
tags: technologies
date: 2020-03-01
ready: true
thumbnail: https://i.imgur.com/zl3UVzR.jpg
slug: get-aws-certified-solution-architect-associate-certificate-with-above-900-points-effective-learning-materials-and-tips
summary: Even if you don't have sophisticated expertise with all AWS services you can still ace the AWS-CSAA exam with 900+ points with the right materials and enough devotion. This article will help you review and prepare better for the exam.
readCount: 10
---

Taking the AWS-CSAA exam requires dedicated effort and a well-prepared learning plan. Fortunately, the AWS-CSAA mostly tests your knowledge about architecture design, which many questions only need you to know the AWS services at a high level. If you already familiarized yourself with AWS's most popular services (VPC, EC2, S3, EBS, RDS, ElastiCache...) and have hands-on experience with them, you can reduce the time you need to learn and review the knowledge related to the exam significantly.

My full-time work involves daily contact with well-known AWS services. Still, in the exam I encountered many questions which asked about other services I have never had any chances to put in practical use (like Snowball, DirectConnector, Elastic Beanstalk, Storage Gateway...). However, thanks to the best courses and mock exams on the Internet that money can buy, I was able to pass the exam with 900+ scores (pass baseline is 720).

![](https://i.imgur.com/Xb3CMeK.jpg)

In this article, I would like to share my learning resources with you, as well as some tips which might be applicable when taking the exam. I had learned and reviewed every day continuously for about 3 months, each day I had spent about 1 hour on reviewing materials (anecdote: I had done this while commuting by train lol). If you can spend more time on speeding up the learning process, or you are a very seasoned AWS engineer, then you can be ready for the exam in just a week, I believe!

### Learning materials

### 1. AWS official exam guide and exam question

This should be the very first step to dip your toe in the water. Knowing the exam structure and what kind of questions asked in the exam will orient your concentration and learning process to the most effective method.

Exam guide: [https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate-Exam-Guide_v1.1_2019_08_27_FINAL.pdf](https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate-Exam-Guide_v1.1_2019_08_27_FINAL.pdf)

Sample questions: [https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Sample-Questions_v4.1_FINAL.pdf](https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Sample-Questions_v4.1_FINAL.pdf)

### 2. AWS-CSAA online course from Udemy by Stephane Maarek

A large number of people reported positive experiences with Acloudguru's course but for me, the course seemed like it was trying to stuff everything it could in my head, with long sessions of talking and knowledge cramming. I felt disengaged after a few videos and ended up returning the course. On the other hand, I loved the way Stephane's course presented materials and detailed knowledge, it was engaging, easy to follow, the subtitle was well-edited (though a few spelling errors still occurred) and the hands-on videos were very helpful and carefully created. The course doesn't just try to get you to pass the exam but it also presents many problems and how they are approached in the real world. The course fully provides slides that are presented for download, source code for hands-on, quizzes after each section and even a complete mock exam. I cannot recommend this course enough! It didn't become the most rated AWS-CSAA course for no reason!

Link: [https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c02/](https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c02/)

### 3. Mock exams on Udemy by tutorialsdojo

There are 6 exams in the course, and their difficulty is respectable. Though the problems' description is a little bit wordy compared to the real exam, they are well-written and the scenarios in the questions are very related to real-world problems. The answer to each question also points out why the correct answer is correct and why the incorrect ones are incorrect, as well as explains services and definitions in each question. The answer also links to the official AWS document to back up its explanation. This is very helpful when you review where you lack understanding and validate your knowledge. Arguably the best bang for the buck if you are looking for a comprehensive mock exam.

Link: [https://www.udemy.com/course/aws-certified-solutions-architect-associate-amazon-practice-exams-saa-c02/](https://www.udemy.com/course/aws-certified-solutions-architect-associate-amazon-practice-exams-saa-c02/)

The lecturer's AWS cheat sheet is distributed free of charge and it's great for quick reference and summarizing up knowledge: [https://tutorialsdojo.com/aws-cheat-sheets/](https://tutorialsdojo.com/aws-cheat-sheets/)

### 4. AWS official study guide: Associate exam book

This book covers the most widely used services at a deeper level, combined with hands-on practices and quizzes to review what you have learned at the end of each section. Honestly, I only used this book as a reference and did the quizzes here. The book's lengthy explanation may dilute your concentration and some of the knowledge here are already outdated (for example, AWS DynamoDB now can do queries in a transaction but the book still says it cannot). Nevertheless, it's worth checking if you want to strengthen your understanding about core AWS services further.

Link: [https://www.amazon.com/Certified-Solutions-Architect-Official-Study-ebook-dp-B01M6W6WYD/dp/B01M6W6WYD/ref=mt_kindle?_encoding=UTF8&me=&qid=](https://www.amazon.com/Certified-Solutions-Architect-Official-Study-ebook-dp-B01M6W6WYD/dp/B01M6W6WYD/ref=mt_kindle?_encoding=UTF8&me=&qid=)

These are the primary resources that I had used to pass the AWS-CSAA exam. I want to share some tips that may be helpful before and during the exam as well.

### Tips

1. If English is not your native language, you can request more time (30 mins more) by using the "Request Exam Accommodation" when scheduling exams.
2. Look for the word that describes the nature of the solution in the question. For example, "most cost-effective" means you have to choose services that prioritize saving, therefore you should consider Spot Instance, Glacier, S3-IA... if it appears in the answer selections, or "highly available" means your solution should introduce some redundancy and disaster countermeasure, therefore Multi-AZ-enabled services or cross-region replication features should be looked at. As far as I know, real exams don't have negative questions (what is NOT the correct answer, what is a FALSE statement, etc...).
3. You need extensive knowledge related to popular AWS services (VPC, EC2, RDS, Elasticache...). For example, you have to understand the statefulness and statelessness of security group feature vs network ACL, or what pricing plan can you choose when creating EC2 instance... but you only need to understand new services of services in specific areas at a high level to be able to answer "which service will you choose" type of questions. For example, you only need to understand that Redshift is a data warehouse and Neptune is a graph database to answer when you are asked "which service is the best for very large set of financial data collection storage" and "which database is the best for implementing a SNS".
4. Process of elimination may work wonderfully when you encounter tough questions. Knowing the other 3 solutions are impractical is enough to select correct answer sometimes.
5. The solution that introduces complicated steps or seems too complex to implement in reality is, more often than not, the wrong answer. AWS is designed to ease the difficulty of development, not worsen it. Unless it doesn't satisfy the requirement in the question, fully managed services should be the correct answer.
6. Review your basic networking knowledge and common IT knowledge is essential too (for example which port does SSH or HTTP use, which scenario should we use cache...)

### Conclusion

Studying for certificates might be overwhelming, but it is not supposed to be done in one day. It would be best if you processed gradually but continuously, regularly review what you have learned, and get as much hands-on experience as possible. Systematize what you have learned into reviewable cheat sheets. Finally, get to do some mock exams to have a feeling of what kinds of questions will be asked. Hopefully with my provided learning resources and tips, you will be able to walk into the testing center fully prepared confidently!