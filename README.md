# Kalendarz Świąt Nietypowych ICS (Google) Exporter

(**English**: Nothing useful here for non-polish speakers.)

Automat do parsowania Kalendarza Świąt Nietypowych z Nonsensopedii. Większość dat jest zbierana automatem, parę jest
parsowanych "z pomocą". Daty "ustalane" są ignorowane, trzeba je dodać ręcznie do kalendarza po zaimportowaniu pliku
ICS.

Wydarzenia dodawane są pod koniec dnia, żeby nie przeszkadzać, gdy w kalendarzu mamy też sensowne wydarzenia :)

## Znane problemy

- Bałagan w kodzie parsującym
- Parser nie rozróżnia czy przecinek jest formą w zdaniu czy rozdziela święto, np:
"Dzień Dzieci, Które Zastępują Żołnierzy" jest dzielone na "Dzień Dzieci" i "Które Zastępują Żołnierzy"

## Do zrobienia

- Naprawić znane problemy
- Opcja wyeksportowania wszystkich świąt z danego dnia w jednym wpisie?
- Wyeliminować wszystkie "typowe" święta, takie jak "Boże Narodzenie", które nijak jest nietypowe i będzie się
duplikowało z ew. "wbudowanymi" świętami w określonych kalendarzach
- Ogarnąć @todo

## FAQ

- Po co to, skoro Nonsensopedia udostępnia to samo? https://goo.gl/z7iSyH

To nie jest to samo - zdaje się, że brakuje tam świąt, dodatkowo do wpisów są pododawane jakieś bzdury.

- Jak to odpalić?

1. Zainstalować relatywnie nowe Node.js (testowane na 11.2)
2. Przejść do folderu z kodem źródłowym
3. `yarn`
4. `yarn createCalendar` dla bieżącego roku, `yarn createCalendar 2019` dla roku 2019, itd.
4. `yarn start` - żeby developować zmiany dla bieżącego roku, `yarn start 2019` żeby developować dla roku 2019, itd.

## Licencja

MIT
