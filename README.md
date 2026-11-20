# Demo: één order, drie systemen

Klikbare demo voor Kroon Kozijn Nederland. Hij laat zien hoe de calculatie (rol van Ramasoft), de boekhouding (rol van Exact Bouw) en CRM-KKN samenwerken als ze gekoppeld zijn op het KKN-nummer, en hoe het vandaag gaat zonder koppeling.

## Openen

- Online via GitHub Pages: `https://<gebruiker>.github.io/<repository>/`
- Lokaal: `python3 -m http.server` in deze map, daarna http://localhost:8000

Open de drie sites naast elkaar in **dezelfde browser**. Ze delen hun gegevens via de opslag van de browser, dus wat je in de ene site doet, verschijnt meteen in de andere. Met de schakelaar onderin zet je de koppeling aan of uit. Het draaiboek staat op de startpagina.

## Inhoud

| Map | Wat |
|---|---|
| `index.html` | Startpagina met draaiboek |
| `calculatie/` | Offerte, tekening, stuklijst, vrijgeven voor productie (KKN), gereedmelden |
| `boekhouding/` | KK Nederland B.V. (fabrieksorders, inkoop, voorraad) en de vestigingen (projecten, termijnen, betalingen), nacalculatie per KKN |
| `crm/` | Orderkaart en orderflow zoals CRM-KKN, met fabrieksstatus, kosten, betaalstatus en "Data koppelen" (offertenummer + adres) |
| `shared/` | Gedeelde demo-gegevens (`store.js`) en de demobalk (`bar.js`) |

Alle klanten, nummers en bedragen zijn verzonnen. De calculatie- en boekhoudschermen zijn nagebouwd naar de werkwijze, niet de echte pakketten; de demo stuurt niets naar een echt systeem.
