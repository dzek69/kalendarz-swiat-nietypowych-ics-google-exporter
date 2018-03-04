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
- Opcja wyeksportowania wszystkich świąt w jednym wpisie?
- Parametryzacja roku?
- Obsługa CLI?
- Wyeliminować wszystkie "typowe" święta, takie jak "Boże Narodzenie", które nijak jest nietypowe i będzie się
duplikowało z ew. "wbudowanymi" świętami w określonych kalendarzach

## FAQ

- Po co to, skoro Nonsensopedia udostępnia to samo? https://goo.gl/z7iSyH

To nie jest to samo - zdaje się, że brakuje tam świąt, dodatkowo do wpisów są pododawane jakieś bzdury.

- Jak to odpalić?

Zainstalować relatywnie nowe Node.js, przejść do folderu z kodem źródłowym i odpalić `npm start`.


## Licencja

MIT