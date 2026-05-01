from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class RegisterSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=25)
    username: Optional[str] = Field(default=None, max_length=80)

class LoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=25)