# AI Voice Calling Architecture

## Purpose

This project implements an AI-powered voice calling and customer support workflow:

**AI Agent → Phone Call → Customer Conversation → Speech Processing → AI Response → Voice Response → Action/Outcome**

## Phase 1

The first implementation milestone establishes the project configuration and secret-management contract. Real API keys must remain outside Git.

## Planned runtime components

- React frontend for the operator dashboard
- Node.js backend for authentication, call orchestration, webhooks, and WebSocket updates
- Twilio for telephone connectivity
- OpenAI Realtime API for conversational speech processing and AI responses
- PostgreSQL for customers, calls, transcripts, summaries, and outcomes

## Security rules

- Never commit `.env` or real API keys.
- Keep provider credentials on the backend only.
- Use HTTPS/WSS in production.
- Validate webhook requests from telephony providers.
- Authenticate dashboard users before exposing call controls.
