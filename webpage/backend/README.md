
# IronPulse Backend Infrastructure

## Tech Stack
- Java 17+
- Spring Boot 3.x
- AWS SDK for DynamoDB
- Project Lombok

## DynamoDB Schema
- **Table Name**: `ram`
- **Partition Key**: `rrr` (String)
- **Attributes**: 
  - `emailId` (String)
  - `phoneNumber` (String, optional)
  - `createdAt` (Number)
  - `alarmTime` (String, e.g., "06:30")

## API Endpoints
1. `POST /api/v1/gym/auth/login`: Handles Google/Phone Auth synchronization.
2. `GET /api/v1/gym/user/{rrr}`: Retrieves user profile and basic stats.
3. `PUT /api/v1/gym/user/{rrr}/alarm`: Updates preferred notification/alarm time.

## Alarm Logic (Backend)
- When `updateAlarmTime` is called, the value is persisted in DynamoDB.
- A **Scheduled Job** (using `@Scheduled` or AWS EventBridge) runs every minute.
- It scans for users with `alarmTime` matching the current time.
- Triggers a notification via **AWS SNS** (SMS) or **Firebase Cloud Messaging** (Push).
