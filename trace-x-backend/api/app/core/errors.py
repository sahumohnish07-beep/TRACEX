from typing import Optional, List, Dict, Any
from fastapi import Request, status, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel


class RFC7807Problem(BaseModel):
    type: str = "about:blank"
    title: str
    status: int
    detail: str
    instance: Optional[str] = None
    invalid_params: Optional[List[Dict[str, Any]]] = None

    class Config:
        json_schema_extra = {
            "example": {
                "type": "https://tracex.police.gov.in/errors/not-found",
                "title": "Resource Not Found",
                "status": 404,
                "detail": "Case with identifier 'CASE-2026-9999' was not found in station registry.",
                "instance": "/api/v1/cases/CASE-2026-9999",
            }
        }


class ProblemException(Exception):
    def __init__(
        self,
        status: int,
        title: str,
        detail: str,
        type_: str = "about:blank",
        instance: Optional[str] = None,
        invalid_params: Optional[List[Dict[str, Any]]] = None,
    ):
        super().__init__(detail)
        self.status = status
        self.title = title
        self.detail = detail
        self.type_ = type_
        self.instance = instance
        self.invalid_params = invalid_params


def problem_exception_handler(request: Request, exc: ProblemException) -> JSONResponse:
    content = {
        "type": exc.type_,
        "title": exc.title,
        "status": exc.status,
        "detail": exc.detail,
        "instance": exc.instance or str(request.url.path),
    }
    if exc.invalid_params:
        content["invalid_params"] = exc.invalid_params

    return JSONResponse(
        status_code=exc.status,
        content=content,
        media_type="application/problem+json",
    )


def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    title_map = {
        400: "Bad Request",
        401: "Unauthorized Authentication",
        403: "Statutory Access Forbidden",
        404: "Resource Not Found",
        409: "Conflict State",
        422: "Unprocessable Entity",
        500: "Internal Server Error",
    }
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "type": f"https://tracex.police.gov.in/errors/{exc.status_code}",
            "title": title_map.get(exc.status_code, "HTTP Error"),
            "status": exc.status_code,
            "detail": str(exc.detail),
            "instance": str(request.url.path),
        },
        media_type="application/problem+json",
    )


def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    errors = []
    for err in exc.errors():
        loc = " -> ".join(str(l) for l in err.get("loc", []))
        errors.append({"field": loc, "reason": err.get("msg", "Invalid format")})

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "type": "https://tracex.police.gov.in/errors/validation-error",
            "title": "Validation Error",
            "status": status.HTTP_422_UNPROCESSABLE_ENTITY,
            "detail": "Request payload validation failed. Check invalid_params for details.",
            "instance": str(request.url.path),
            "invalid_params": errors,
        },
        media_type="application/problem+json",
    )
