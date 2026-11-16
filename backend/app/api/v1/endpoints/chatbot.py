"""
Chatbot Endpoints
Provides an API for natural-language air quality queries using live sensor data
and an open-source offline LLM engine.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from app.core.logging import get_logger
from app.services.chatbot_service import chatbot_service

router = APIRouter()
logger = get_logger(__name__)


class ChatMessage(BaseModel):
    role: str = Field(..., description="Role: 'user' or 'assistant'")
    content: str = Field(..., description="Message text content")


class ChatQueryRequest(BaseModel):
    message: str = Field(..., description="User query about air quality, weather, health, or exercise")
    latitude: Optional[float] = Field(None, description="Current client latitude")
    longitude: Optional[float] = Field(None, description="Current client longitude")
    location_name: Optional[str] = Field(None, description="Current client location name")
    history: Optional[List[ChatMessage]] = Field(default=[], description="Recent conversation turns for context")


class ChatQueryResponse(BaseModel):
    reply: str
    location: Dict[str, Any]
    telemetry: Dict[str, Any]
    model_used: str
    timestamp: str


@router.post("/query", response_model=ChatQueryResponse)
async def query_chatbot(payload: ChatQueryRequest):
    """
    Handle user natural language questions about air quality anywhere.
    Combines real-time telemetry from EPA / OpenAQ / Weather with offline LLM reasoning.
    """
    try:
        logger.info(f"Chatbot query received: '{payload.message}'")
        history_dicts = [{"role": m.role, "content": m.content} for m in (payload.history or [])]
        
        result = await chatbot_service.generate_response(
            query=payload.message,
            client_lat=payload.latitude,
            client_lon=payload.longitude,
            client_location_name=payload.location_name,
            history=history_dicts
        )
        return result
    except Exception as e:
        logger.error(f"Error handling chatbot query: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Chatbot processing error: {str(e)}")


@router.get("/status")
async def chatbot_status():
    """
    Check the status of the offline LLM engine and local Ollama connectivity.
    """
    ollama_ok, model_name = await chatbot_service.check_ollama_availability()
    return {
        "status": "online",
        "engine": "Open-Source Offline Atmospheric LLM Engine",
        "ollama_available": ollama_ok,
        "ollama_model": model_name if ollama_ok else None,
        "features": [
            "Global location entity resolution",
            "Live multi-pollutant telemetry grounding (PM2.5, PM10, O3, NO2)",
            "Health & activity advisory synthesis",
            "Zero-latency offline fallback"
        ]
    }

