# System Zarządzania Dokumentami i Organizacją Pracy

### 1. Wstęp
  System zarządzania dokumentami i organizacją pracy dla firm,
  który umożliwia przetwarzanie dokumentów Word/Excel,
  organizowanie zadań i projektów oraz zarządzanie bazą danych.
  System działa na backendzie opartym na C#, zapewniając centralizację
  procesów biurowych i usprawnienie zarządzania dokumentacją.

### 2. Wymagania systemowe
- Wymagania funkcjonalne
	- Centralizacja zarządzania dokumentami i zadaniami (wszystko w jednym miejscu)
	- Edycja dokumentów i zarządzanie tabelami w stylu Word + Excel
	- Planowanie spotkań i zadań wbudowane w kalendarz
	- Integracja e-mailowa do obsługi korespondencji ?
	- Wsparcie dla rysowania i szybkich notatek
	- Wspólna edycja dokumentów w czasie rzeczywistym ?
	- Zaawansowane funkcje obliczeniowe dla biur (konwersja walut, harmonogramowanie projektów, kalkulacje budżetowe) ?
	- Integracja z zewnętrznymi systemami np. Google Calendar, Outlook ?
	- converter pdf to word – word to pdf itd

- Wymagania niefunkcjonalne
	- System oparty na backendzie w C#
	- Bezpieczeństwo danych (JWT, ochrona przed SQL Injection i XSS)
	- Optymalizacja wydajności (async/await, caching, lazy loading)
	- Możliwość testowania i walidacji API (Postman, testy jednostkowe)
	- Wydajna baza danych (MySQL Server)
	- Przejrzysty interfejs użytkownika (React, Tailwind CSS) ?

### 4. Struktura projektu
  
  - Word-like Edytor
    - Zaawansowana edycja tekstu (formatowanie, style, nagłówki)
    - Eksport dokumentów do różnych formatów (PDF, DOCX, TXT, CSV)
    - Gotowe rozwiązania: TinyMCE, Quill
  
  - Excel-like Arkusze
    - Obsługa arkuszy kalkulacyjnych
    - Tworzenie tabel, sortowanie, filtrowanie danych
    - Podstawowe funkcje matematyczne i logiczne
    - Gotowe rozwiązania: jSpreadsheet, SheetJS, Luckysheet
  
  - Graficzne Notatki (Sticky Notes)
    - Tworzenie szybkich notatek tekstowych
    - Rysowanie schematów i diagramów
    - Gotowe rozwiązania: Excalidraw, Konva.js
  
  - To-do List
    - Tworzenie zadań i przypisywanie terminów
    - Automatyczne przypomnienia
    - Gotowe rozwiązania: To-Do List JavaScript
  
  - Kalendarz
    - Planowanie spotkań i wydarzeń
    - Przypomnienia o nadchodzących terminach
    - Synchronizacja z systemami zewnętrznymi (np. Google Calendar, Outlook)
    - Gotowe rozwiązania: FullCalendar, Calendar JS
  
  - Integracja e-mailowa (Gmail, Outlook)
    - Wysyłanie i odbieranie wiadomości e-mail
    - Przypisywanie e-maili do dokumentów
    - Gotowe biblioteki: Gmail API (Google), Microsoft Graph API (Outlook)
  
  - JWT Tokeny i Autoryzacja Użytkowników
    - Autoryzacja użytkowników za pomocą JWT
    - Rejestracja, logowanie i zarządzanie sesjami użytkowników
    - Bezpieczne przechowywanie i weryfikacja haseł
    - Gotowe biblioteki: System.IdentityModel.Tokens.Jwt, Microsoft.AspNetCore.Authentication.JwtBearer

### 4. Rozszerzenia: Zastosowanie szablonów, optymalizacja, bezpieczeństwo, testy
- Szablony w Projekcie:
	- Routing i Kontrolery (MVC, minimal API)
	- Szablon Repository & Service

- Optymalizacja Kodu:
	- Asynchroniczność (async/await)
	- Caching (np. Redis)
	- Lazy Loading
  
- Bezpieczeństwo Kodu:
	- Autoryzacja i Autentykacja (OAuth2, JWT)
	- Ochrona przed SQL Injection i XSS
	- Zasady bezpieczeństwa API (HTTPS, CORS)

- Testy Penetracyjne:
	- Automatyczne Testy Bezpieczeństwa
	- Ręczne Testy Penetracyjne (Burp Suite, OWASP ZAP)

- Używanie Postman do Testowania API:
	- Testowanie metod HTTP (GET, POST, PUT, DELETE)
	- Tworzenie zestawów testów
	- Walidacja odpowiedzi API

- Testy Jednostkowe w C#:
	- Frameworki do testów (MSTest, NUnit, xUnit)
	- Mockowanie zależności (Moq)
	- Testy API (HttpClient, xUnit)
	- Testy Integracyjne

### 5. Stack Technologiczny
  - Frontend: HTML, CSS, JavaScript (Frameworks: React, Tailwind CSS) ?
  - Backend: C#, .NET Core, ASP.NET Core, REST API
  - Baza danych: MySQL Server
  - Autoryzacja: JWT

### 6. Przykładowy wygląd aplikacji
<img src="./Projekt TEMP.png">
