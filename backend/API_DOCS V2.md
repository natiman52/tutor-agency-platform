# 🎓 Tutor Marketplace API Documentation


| File Category | Resource Name | Status |
| :--- | :--- | :--- |
| 🔑 **Core** | [Authentication](#-authentication-api-auth) | ![Live](https://img.shields.io/badge/Status-Live-green) |
| 👨‍🏫 **Marketplace** | [Tutor Profiles](#-tutor-profiles-api-tutors) | ![Started](https://img.shields.io/badge/Status-Started-blue) |
| 💼 **Operations** | [Gig System](#-gig-system-api-gigs) | ![Not Started](https://img.shields.io/badge/Status-Deactive-red) |
| 💰 **Finance** | [Balance & Payments](#-balance--payments-api-wallet) | ![Not Started](https://img.shields.io/badge/Status-Deactive-red) |

---

## 🔑 Authentication (`/api/auth/`)
All authentication endpoints utilize **HTTP-only JWT cookies**. The client must include `credentials: 'include'` in all fetch/axios requests.

### 📍 Session Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/user/` | Get current authenticated user session |
| `POST` | `/login/` | standard `dj-rest-auth` login |
| `POST` | `/logout/` | standard `dj-rest-auth` logout |
| `POST` | `/token/refresh/` | Manually rotate the access cookie |
| `POST` | `/google/` | Google OAuth token exchange |

### 📍 Account & Security
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/registration/` | Register new account (Requires: phone, location, role) |
| `POST` | `/finish-signup/` | Finish profile after Social/Third-party login |
| `POST` | `/password/reset/` | Trigger password reset (Email/OTP) |
| `POST` | `/password/reset/verify/` | Verify the reset token/OTP |
| `POST` | `/changepassword/` | Change password (Auth required) |
| `POST` | `/verifyotp/` | General purpose OTP verification |

#### 📥 Registration Payload
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password1": "securepassword",
  "phone_number": "+251911223344",
  "location": "Addis Ababa",
  "role": "tutor"
}
```

#### 📥 Finish Signup Payload (Social Login completion)
```json
{
  "phone_number": "+251911223344",
  "location": "Addis Ababa",
  "role": "tutor",
  "subject": 1, 
  "hourly_rate": 250.00
}
```
> **Note:** `subject` and `hourly_rate` are required if `role` is `tutor`.



## 👨‍🏫 Tutor Profiles (`/api/auth/users/`)
Endpoints for listing, searching, and managing tutor marketplace profiles.

### 🔍 Discovery (Public)
| Method | Endpoint | Description | Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List/Search all tutors | `q`, `subject`, `location`, `min_rating`, `page` |
| `GET` | `/{id}/` | Retrieve a specific tutor | — |
| `POST` | `/{id}/contact/` | Send enquiry to tutor | — |

> **Search Example:**
> `GET /api/tutors/?q=math&subject=algebra&min_rating=4`

### 📁 Portfolio Items (`/api/auth/users/portfolio/`)
The Portfolio is a collection of `PortfolioItem` models. This allows tutors to showcase a list of specific achievements or past works.

| Method | Endpoint | Description | Permission |
| :--- | :--- | :--- | :--- |
| `GET` | `/tutors/{id}/portfolio/` | Get list of portfolio models | Public |
| `POST` | `portfolio/` | Add a new model to the list | Tutor Only |
| `PUT` | `/api/tutors/portfolio/{item_id}/` | Update a specific item | Owner |
| `DELETE`| `/api/tutors/portfolio/{item_id}/` | Remove item from list | Owner |

**Portfolio Model Payload:**
```json
{
  "title": "Fullstack Web App Project",
  "description": "Built a custom LMS for a local school.",
  "media_url": "[https://cdn.example.com/media/project1.jpg](https://cdn.example.com/media/project1.jpg)",
  "external_link": "[https://github.com/tutor/project](https://github.com/tutor/project)",
  "category": "Project" 
}
```

### 🛠️ Profile Management (Authenticated)
| Method | Endpoint | Description | Permission |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/auth/users/me/` | Get current user's profile | Authenticated |
| `POST` | `/api/auth/users/me/update/` | Update my own profile | Authenticated |
| `GET` | `/api/auth/users/{id}/` | See any user profile by ID | Anyone |
| `PATCH` | `/api/auth/users/me/update/` | Partial profile update | Authenticated |

#### 📥 Payload: Create/Update Profile
```json
{
  "bio": "Experienced math tutor with 5 years experience.",
  "subjects": ["Algebra", "Calculus", "Geometry"],
  "hourly_rate": 35.00,
  "location": "Lagos, NG",
  "experience_years": 5,
  "available": true
}
```
## 💼 Gig System (`/api/core/gigs/`)
Handles the workflow between a student and a tutor.

| Method | Endpoint | Description | Permission |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List my gigs (as tutor) | Authenticated |
| `POST` | `/create/` | create a new gig | Tutor |
| `PATCH`| `update/{id}/` | update a gig | Owner/Tutor |
| `DELETE`| `delete/{id}/` | delete a gig | Owner/Tutor |

> **Search Example:**
> `GET /api/gigs/?q=math&subject=algebra`


## 💰 Balance & Payments (`/api/auth/wallet/`)
Manages user credits and transaction history via Chapa.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Get current balance and transaction history |
| `POST` | `/deposit/` | Initiate deposit (Returns Chapa checkout URL) |
| `POST` | `/withdraw/` | Initiate withdrawal (Chapa Transfer) |
| `GET` | `/verify/{tx_ref}/` | Verify transaction status |

**Deposit Payload:**
```json
{
  "amount": 500
}
```

**Withdrawal Payload:**
```json
{
  "amount": 200,
  "account_name": "John Doe",
  "account_number": "1000123456789",
  "bank_code": "967e8c34-a3f2-4efb-916c-e45c7d812222"
}
```

---

## 📚 Resource Lists & Filtering

### 📍 Subjects (`/api/core/subjects/`)
| Method | Endpoint | Description | Filter Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/core/subjects/` | List all subjects | `name`, `name__icontains` |

### 📍 Users (`/api/auth/users/`)
| Method | Endpoint | Description | Filter Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/auth/users/` | List all users | `role`, `subject`, `location`, `location__icontains` |

### 📍 Portfolios (`/api/auth/portfolios/`)
| Method | Endpoint | Description | Filter Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/auth/portfolios/` | List all portfolios | `user` |
| `GET` | `/api/auth/portfolios/tutor/{user_id}/` | Get portfolio for a specific tutor | — |

