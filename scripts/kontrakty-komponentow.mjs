// =============================================================================
// Kontrakty pozycji katalogu wraz z przepisami renderowania [widoki generowane §2a].
//
// Przepis deklaruje, z jakich elementów składa się komponent i KTÓRY TOKEN steruje
// którą właściwością, w rozbiciu na warianty i stany. Silnik widoków jest jeden
// i generyczny — nowa pozycja katalogu nie wymaga zmiany w kodzie platformy.
//
// Dwie pozycje niosą zasiane rozjazdy renderu (materiał dla drugiego detektora):
//   · baner        — zużywa wyłącznie przestarzałe prymitywy spoza kolekcji marek,
//                    więc przełączenie marki go nie przemalowuje,
//   · wiersz-tabeli — niesie wartości wpisane na sztywno, zliczane przez licznik.
//
// Kontrola spójności: scripts/sprawdz-kontrakty.mjs (ścieżki wobec kanonu, zgodność
// deklaracji zużycia z przepisem, osie wobec rejestru, brak wypełniacza w opisach).
// Plik generowany maszynowo z materiału projektowego; poprawki nanoś tutaj.
// =============================================================================

export const KONTRAKTY = {
  "przycisk": {
    "osie": {
      "odmiana": [
        "podstawowa",
        "drugorzedna",
        "destrukcyjna"
      ],
      "rozmiar": [
        "maly",
        "sredni",
        "duzy"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "odmiana",
          "type": "enum",
          "enum": [
            "podstawowa",
            "drugorzedna",
            "destrukcyjna"
          ],
          "required": true,
          "default": "podstawowa",
          "description": "Waga akcji w układzie: podstawowa to jedyna akcja domyślna na widoku, drugorzędna towarzyszy jej bez wypełnienia, destrukcyjna otwiera potwierdzenie usunięcia."
        },
        {
          "name": "rozmiar",
          "type": "enum",
          "enum": [
            "maly",
            "sredni",
            "duzy"
          ],
          "required": false,
          "default": "sredni",
          "description": "Wysokość i dopełnienie poziome; mały służy paskom narzędzi w tabeli, duży pojedynczej akcji w sekcji powitalnej."
        },
        {
          "name": "etykieta",
          "type": "string",
          "required": true,
          "default": "Zapisz zmiany",
          "description": "Tekst akcji zapisany czasownikiem w trybie rozkazującym lub w bezokoliczniku; próbka renderu bierze wartość domyślną."
        },
        {
          "name": "wylaczony",
          "type": "boolean",
          "required": false,
          "default": false,
          "description": "Blokuje wywołanie akcji, ale nie usuwa przycisku z kolejności odczytu — powód blokady podaje tekst pomocniczy obok."
        },
        {
          "name": "pelnaSzerokosc",
          "type": "boolean",
          "required": false,
          "default": false,
          "description": "Rozciąga przycisk do szerokości rodzica; używane w oknie dialogowym na wąskim ekranie i w formularzu logowania."
        }
      ],
      "states": {
        "spoczynek": "W odmianie podstawowej: pełne tło akcji, etykieta w kolorze odwróconym, bez obwódki. Wysokość jest stała dla danego rozmiaru, więc rząd przycisków w pasku akcji trzyma równą linię.",
        "najechanie": "Kursor nad prostokątem przycisku; tło schodzi o jeden krok skali w ciemniejszą stronę, a wymiary i grubość obwódki nie zmieniają się, żeby sąsiednie elementy nie przesuwały się w układzie.",
        "wcisniety": "Trwa wciśnięcie wskaźnika lub przytrzymanie spacji; tło przechodzi w odcień aktywny i utrzymuje się do zwolnienia klawisza albo przycisku myszy.",
        "skupienie": "Przycisk wskazany klawiaturą; obrys w kolorze skupienia rysuje się na zewnątrz obwódki, więc nie zabiera miejsca etykiecie i nie zmienia wysokości przycisku.",
        "wylaczony": "Tło wyciszone, etykieta w kolorze tekstu wyłączonego; kliknięcie i klawisze nie wywołują akcji, ale element zostaje w kolejności Tab i jest odczytywany przez czytnik ekranu."
      },
      "behavior": {
        "obszarKlikalny": "Cały prostokąt przycisku wraz z dopełnieniem. Przy rozmiarze małym widoczna wysokość wynosi 32 piksele i jest uzupełniana przezroczystym marginesem do 44 pikseli pola dotykowego.",
        "ochronaPrzedPodwojnymWyslaniem": "Pierwsze kliknięcie wywołuje akcję i przełącza przycisk w stan wyłączony do czasu odpowiedzi; kliknięcia w tym oknie są odrzucane bez ponownego żądania.",
        "odmianaDestrukcyjna": "Odmiana destrukcyjna nigdy nie usuwa danych od razu — wywołuje okno dialogowe z potwierdzeniem, a właściwe usunięcie następuje dopiero z tamtego okna.",
        "pelnaSzerokosc": "Przy włączonej pełnej szerokości przycisk rozciąga się do rodzica, dopełnienie poziome zostaje bez zmian, a etykieta zostaje wyśrodkowana w nowej szerokości.",
        "lamanieEtykiety": "Etykieta nie łamie się na dwa wiersze. Gdy przycisk ma narzuconą szerokość — pełną szerokość rodzica albo stałą szerokość kolumny — tekst dłuższy niż dostępne miejsce jest przycinany wielokropkiem; to sygnał do skrócenia treści, a nie do poszerzenia przycisku."
      },
      "a11y": {
        "rola": "button; przy akcji nawigującej do innego adresu komponent renderuje się jako odnośnik i traci obsługę spacji.",
        "klawiatura": "Enter i spacja wyzwalają akcję, spacja dopiero po zwolnieniu klawisza. Tab wprowadza i wyprowadza skupienie, Escape nie ma tu znaczenia.",
        "czytnikEkranu": "Nazwa pochodzi z widocznej etykiety, więc pokrywa się z komendą, którą wypowiada użytkownik sterowania głosem. Blokada jest ogłaszana przez aria-disabled, dzięki czemu przycisk zostaje w kolejności Tab.",
        "stanZadania": "Na czas żądania przycisk dostaje aria-busy, a etykieta pozostaje niezmieniona — zmiana tekstu w trakcie żądania gubiłaby punkt odniesienia dla czytnika.",
        "kontrast": "Para tła akcji podstawowej i treści odwróconej trzyma kontrast co najmniej 4,5 do 1. Obrys skupienia trzyma co najmniej 3 do 1 wobec tła strony, bo leży poza obwódką i to z tłem strony sąsiaduje."
      },
      "tokenConsumption": [
        "rdzen.komponent.przycisk-tlo",
        "rdzen.komponent.przycisk-tresc",
        "rdzen.komponent.przycisk-tresc-odwrocona",
        "rdzen.komponent.przycisk-obwodka",
        "rdzen.komponent.przycisk-tlo-najechanie",
        "rdzen.komponent.przycisk-tlo-wylaczone",
        "rdzen.semantic.akcja-podstawowa-aktywna",
        "rdzen.semantic.akcja-destrukcyjna",
        "rdzen.semantic.tlo-powierzchnia",
        "rdzen.semantic.obwodka-skupienie",
        "rdzen.semantic.tekst-wylaczony",
        "rdzen.semantic.promien-interakcja",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.semantic.odstep-zwykly",
        "rdzen.semantic.odstep-luzny",
        "rdzen.semantic.typografia-przycisk",
        "rdzen.semantic.typografia-podpis",
        "rdzen.semantic.typografia-tresc-duza",
        "rdzen.rozmiar.odstep-400",
        "rdzen.rozmiar.odstep-500",
        "rdzen.rozmiar.odstep-600",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.rozmiar.obwodka-srednia",
        "rdzen.typografia.grubosc-srednia",
        "rdzen.typografia.wysokosc-ciasna",
        "rdzen.typografia.rodzina-podstawowa"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "box",
          "children": [
            "etykieta"
          ],
          "bind": {
            "background": {
              "token": "rdzen.komponent.przycisk-tlo"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-500"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            }
          }
        },
        {
          "id": "etykieta",
          "element": "text",
          "textFrom": "props.etykieta.default",
          "bind": {
            "color": {
              "token": "rdzen.komponent.przycisk-tresc-odwrocona"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-przycisk"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        }
      ],
      "variants": {
        "odmiana": {
          "drugorzedna": {
            "root": {
              "background": {
                "token": "rdzen.semantic.tlo-powierzchnia"
              },
              "borderWidth": {
                "token": "rdzen.rozmiar.obwodka-cienka"
              },
              "borderColor": {
                "token": "rdzen.komponent.przycisk-obwodka"
              }
            },
            "etykieta": {
              "color": {
                "token": "rdzen.komponent.przycisk-tresc"
              }
            }
          },
          "destrukcyjna": {
            "root": {
              "background": {
                "token": "rdzen.semantic.akcja-destrukcyjna"
              }
            }
          }
        },
        "rozmiar": {
          "maly": {
            "root": {
              "height": {
                "token": "rdzen.rozmiar.odstep-400"
              },
              "paddingX": {
                "token": "rdzen.semantic.odstep-ciasny"
              }
            },
            "etykieta": {
              "fontSize": {
                "token": "rdzen.semantic.typografia-podpis"
              }
            }
          },
          "duzy": {
            "root": {
              "height": {
                "token": "rdzen.rozmiar.odstep-600"
              },
              "paddingX": {
                "token": "rdzen.semantic.odstep-luzny"
              }
            },
            "etykieta": {
              "fontSize": {
                "token": "rdzen.semantic.typografia-tresc-duza"
              }
            }
          }
        }
      },
      "states": {
        "najechanie": {
          "root": {
            "background": {
              "token": "rdzen.komponent.przycisk-tlo-najechanie"
            }
          }
        },
        "wcisniety": {
          "root": {
            "background": {
              "token": "rdzen.semantic.akcja-podstawowa-aktywna"
            }
          }
        },
        "skupienie": {
          "root": {
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            }
          }
        },
        "wylaczony": {
          "root": {
            "background": {
              "token": "rdzen.komponent.przycisk-tlo-wylaczone"
            }
          },
          "etykieta": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          }
        }
      }
    }
  },
  "przycisk-drugorzedny": {
    "osie": {
      "rozmiar": [
        "maly",
        "sredni",
        "duzy"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "rozmiar",
          "type": "enum",
          "enum": [
            "maly",
            "sredni",
            "duzy"
          ],
          "required": false,
          "default": "sredni",
          "description": "Wysokość i dopełnienie poziome; rozmiar musi być zgodny z rozmiarem przycisku podstawowego, obok którego przycisk stoi w parze akcji."
        },
        {
          "name": "etykieta",
          "type": "string",
          "required": true,
          "default": "Anuluj",
          "description": "Tekst akcji towarzyszącej — najczęściej wycofanie lub powrót; próbka renderu bierze wartość domyślną."
        },
        {
          "name": "wylaczony",
          "type": "boolean",
          "required": false,
          "default": false,
          "description": "Blokuje akcję. Dla drogi wycofania stosowane wyjątkowo: anulowanie powinno zostać dostępne nawet gdy zapis trwa."
        }
      ],
      "states": {
        "spoczynek": "Wypełnienie w kolorze powierzchni, cienka obwódka i etykieta w kolorze treści przycisku. Brak wypełnienia akcentem odróżnia go od akcji podstawowej stojącej obok.",
        "najechanie": "Wypełnienie zmienia się w subtelne tło akcentu, a obwódka przechodzi w odcień najechania akcji podstawowej; grubość obwódki zostaje ta sama, więc krawędź nie drga pod kursorem.",
        "skupienie": "Obrys skupienia rysowany na zewnątrz obwódki, w odstępie od niej, żeby dwie linie nie zlewały się w jedną grubszą.",
        "wylaczony": "Obwódka schodzi do odcienia subtelnego, a etykieta do koloru tekstu wyłączonego; wypełnienie zostaje w kolorze powierzchni, bo to jedyne tło, jakie ten przycisk ma."
      },
      "behavior": {
        "parowanieAkcji": "Stoi po lewej stronie przycisku podstawowego w parze akcji, oddzielony jednym krokiem odstępu zwykłego; w oknie dialogowym kolejność jest odwracana zgodnie z konwencją systemu operacyjnego.",
        "wypelnieniePowierzchni": "Wypełnienie bierze token powierzchni, a nie przezroczystość. To świadomy wybór: przycisk niesie własne tło, więc etykieta zostaje czytelna także wtedy, gdy pod spodem leży obraz albo wzór zamiast jednolitego koloru. Na powierzchni w innym kolorze niż domyślna przycisk trzeba osadzić w karcie, bo inaczej jego prostokąt tła stanie się widoczny.",
        "obwodkaStalaGrubosc": "Obwódka ma jedną grubość we wszystkich trzech rozmiarach; skalowanie jej razem z wysokością sprawiłoby, że duży przycisk wyglądałby ciężej niż przycisk podstawowy tej samej wielkości.",
        "brakBlokadyPoKlikniecu": "W odróżnieniu od przycisku podstawowego nie blokuje się na czas żądania — wycofanie musi pozostać klikalne także wtedy, gdy operacja główna jeszcze trwa."
      },
      "a11y": {
        "rola": "button, także wtedy gdy przycisk zamyka okno dialogowe — zamknięcie okna nie jest przejściem pod inny adres, więc komponent nie renderuje się jako odnośnik.",
        "klawiatura": "Enter i spacja wyzwalają akcję. W oknie dialogowym akcja tego przycisku jest dodatkowo podpięta pod Escape, ale skrót obsługuje okno, nie sam przycisk.",
        "czytnikEkranu": "Nazwa pochodzi z widocznej etykiety. Drugorzędność jest informacją czysto wizualną i nie jest ogłaszana — kolejność w drzewie mówi o niej wystarczająco.",
        "kontrast": "Obwódka jako jedyny nośnik krawędzi trzyma kontrast co najmniej 3 do 1 wobec tła powierzchni, także w stanie najechania."
      },
      "tokenConsumption": [
        "rdzen.komponent.przycisk-tresc",
        "rdzen.komponent.przycisk-obwodka",
        "rdzen.semantic.tlo-powierzchnia",
        "rdzen.semantic.tlo-akcent-subtelne",
        "rdzen.semantic.akcja-podstawowa-najechanie",
        "rdzen.semantic.obwodka-subtelna",
        "rdzen.semantic.obwodka-skupienie",
        "rdzen.semantic.tekst-wylaczony",
        "rdzen.semantic.promien-interakcja",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.semantic.odstep-zwykly",
        "rdzen.semantic.odstep-luzny",
        "rdzen.semantic.typografia-przycisk",
        "rdzen.semantic.typografia-podpis",
        "rdzen.semantic.typografia-tresc-duza",
        "rdzen.rozmiar.odstep-400",
        "rdzen.rozmiar.odstep-500",
        "rdzen.rozmiar.odstep-600",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.rozmiar.obwodka-srednia",
        "rdzen.typografia.grubosc-srednia",
        "rdzen.typografia.wysokosc-ciasna",
        "rdzen.typografia.rodzina-podstawowa"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "box",
          "children": [
            "etykieta"
          ],
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-powierzchnia"
            },
            "borderColor": {
              "token": "rdzen.komponent.przycisk-obwodka"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-500"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            }
          }
        },
        {
          "id": "etykieta",
          "element": "text",
          "textFrom": "props.etykieta.default",
          "bind": {
            "color": {
              "token": "rdzen.komponent.przycisk-tresc"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-przycisk"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        }
      ],
      "variants": {
        "rozmiar": {
          "maly": {
            "root": {
              "height": {
                "token": "rdzen.rozmiar.odstep-400"
              },
              "paddingX": {
                "token": "rdzen.semantic.odstep-ciasny"
              }
            },
            "etykieta": {
              "fontSize": {
                "token": "rdzen.semantic.typografia-podpis"
              }
            }
          },
          "duzy": {
            "root": {
              "height": {
                "token": "rdzen.rozmiar.odstep-600"
              },
              "paddingX": {
                "token": "rdzen.semantic.odstep-luzny"
              }
            },
            "etykieta": {
              "fontSize": {
                "token": "rdzen.semantic.typografia-tresc-duza"
              }
            }
          }
        }
      },
      "states": {
        "najechanie": {
          "root": {
            "background": {
              "token": "rdzen.semantic.tlo-akcent-subtelne"
            },
            "borderColor": {
              "token": "rdzen.semantic.akcja-podstawowa-najechanie"
            }
          }
        },
        "skupienie": {
          "root": {
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            }
          }
        },
        "wylaczony": {
          "root": {
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            }
          },
          "etykieta": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          }
        }
      }
    }
  },
  "przycisk-ikonowy": {
    "osie": {
      "rozmiar": [
        "maly",
        "sredni"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "rozmiar",
          "type": "enum",
          "enum": [
            "maly",
            "sredni"
          ],
          "required": false,
          "default": "sredni",
          "description": "Średnica pola i wielkość ikony; mały mieści się w wierszu tabeli obok treści komórki, średni stoi samodzielnie w pasku akcji."
        },
        {
          "name": "ikona",
          "type": "enum",
          "enum": [
            "olowek",
            "kosz",
            "lupa",
            "krzyzyk",
            "plus",
            "dzwonek",
            "menu"
          ],
          "required": true,
          "default": "olowek",
          "description": "Nazwa piktogramu z zestawu; próbka renderu bierze wartość domyślną, czyli ołówek dla akcji edycji."
        },
        {
          "name": "etykietaDostepnosci",
          "type": "string",
          "required": true,
          "default": "Edytuj pozycję",
          "description": "Nazwa akcji dla czytnika ekranu i dla podpowiedzi. Jedyne źródło nazwy komponentu — ikona sama nie niesie tekstu."
        },
        {
          "name": "wylaczony",
          "type": "boolean",
          "required": false,
          "default": false,
          "description": "Blokuje akcję i wygasza ikonę; podpowiedź nadal się pokazuje, bo to ona wyjaśnia, czym ta niedostępna akcja jest."
        }
      ],
      "states": {
        "spoczynek": "Okrągłe pole w tle wyciszonym z ikoną w kolorze treści przycisku; bez obwódki, żeby rząd takich przycisków nie tworzył siatki kresek.",
        "najechanie": "Pole przechodzi w subtelne tło akcentu — zmienia się wyłącznie tło koła, ikona zachowuje kolor i wielkość.",
        "skupienie": "Obrys skupienia biegnie po okręgu na zewnątrz pola, więc jest widoczny również gdy przycisk siedzi tuż przy krawędzi paska akcji.",
        "wylaczony": "Tło schodzi do odcienia wyłączonego, a ikona do koloru tekstu wyłączonego. Blokada idzie przez aria-disabled, nie przez atrybut disabled, więc przycisk zostaje osiągalny strzałkami wewnątrz paska akcji i czytnik zdąży przeczytać jego nazwę."
      },
      "behavior": {
        "obszarDotyku": "Widoczne koło ma 40 pikseli przy rozmiarze średnim i 32 przy małym, ale pole dotykowe jest rozszerzone przezroczystym marginesem do 44 na 44 piksele; sąsiadujące przyciski rozdziela odstęp na tyle duży, że rozszerzone pola się nie nakładają.",
        "etykietaObowiazkowa": "Bez wypełnionej etykiety dostępności komponent nie renderuje się wcale — brak tekstu widocznego oznacza, że nazwa musi przyjść z propsa i nie ma wartości zastępczej.",
        "podpowiedz": "Podpowiedź z treścią etykiety dostępności pojawia się po pół sekundy najechania i natychmiast po skupieniu klawiaturą; znika przy opuszczeniu wskaźnika oraz po Escape.",
        "grupowanie": "W pasku akcji przyciski ikonowe stoją w jednym rzędzie bez separatorów; rozdzielenie zadań sygnalizuje odstęp większy między grupami, a nie kreska.",
        "brakZmianyIkony": "Ikona nie zmienia się po kliknięciu. Przełączanie dwóch stanów jednym piktogramem — na przykład dzwonek włączony i wyciszony — należy do przełącznika, bo tam zmiana stanu jest ogłaszana czytnikowi; tutaj byłaby niema."
      },
      "a11y": {
        "rola": "button; ikona wewnątrz jest oznaczona jako dekoracyjna (aria-hidden), żeby czytnik nie odczytał jej nazwy pliku obok nazwy akcji.",
        "klawiatura": "Enter i spacja wyzwalają akcję. W pasku akcji Tab wchodzi do pierwszego przycisku, a strzałki poziome przenoszą skupienie między przyciskami w grupie.",
        "czytnikEkranu": "Nazwa pochodzi wyłącznie z etykiety dostępności podanej przez aria-label; treść musi być czasownikowa, bo użytkownik sterowania głosem wypowiada ją dosłownie.",
        "kontrast": "Ikona jako jedyny nośnik znaczenia trzyma kontrast co najmniej 3 do 1 wobec tła pola, także w stanie najechania; grubość kreski piktogramu nie schodzi poniżej półtora piksela przy rozmiarze małym."
      },
      "tokenConsumption": [
        "rdzen.komponent.przycisk-tresc",
        "rdzen.komponent.przycisk-tlo-wylaczone",
        "rdzen.semantic.tlo-wyciszone",
        "rdzen.semantic.tlo-akcent-subtelne",
        "rdzen.semantic.obwodka-skupienie",
        "rdzen.semantic.tekst-wylaczony",
        "rdzen.semantic.promien-pelny",
        "rdzen.semantic.odstep-przylegly",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.rozmiar.odstep-400",
        "rdzen.rozmiar.odstep-500",
        "rdzen.rozmiar.obwodka-srednia",
        "rdzen.rozmiar.ikona-maly",
        "rdzen.rozmiar.ikona-sredni"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "box",
          "children": [
            "ikona"
          ],
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            },
            "width": {
              "token": "rdzen.rozmiar.odstep-500"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-500"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "radius": {
              "token": "rdzen.semantic.promien-pelny"
            }
          }
        },
        {
          "id": "ikona",
          "element": "icon",
          "iconName": "olowek",
          "bind": {
            "color": {
              "token": "rdzen.komponent.przycisk-tresc"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-sredni"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-sredni"
            }
          }
        }
      ],
      "variants": {
        "rozmiar": {
          "maly": {
            "root": {
              "width": {
                "token": "rdzen.rozmiar.odstep-400"
              },
              "height": {
                "token": "rdzen.rozmiar.odstep-400"
              },
              "paddingX": {
                "token": "rdzen.semantic.odstep-przylegly"
              },
              "paddingY": {
                "token": "rdzen.semantic.odstep-przylegly"
              }
            },
            "ikona": {
              "width": {
                "token": "rdzen.rozmiar.ikona-maly"
              },
              "height": {
                "token": "rdzen.rozmiar.ikona-maly"
              }
            }
          }
        }
      },
      "states": {
        "najechanie": {
          "root": {
            "background": {
              "token": "rdzen.semantic.tlo-akcent-subtelne"
            }
          }
        },
        "skupienie": {
          "root": {
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            }
          }
        },
        "wylaczony": {
          "root": {
            "background": {
              "token": "rdzen.komponent.przycisk-tlo-wylaczone"
            }
          },
          "ikona": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          }
        }
      }
    }
  },
  "pole-tekstowe": {
    "osie": {
      "stan": [
        "zwykly",
        "skupienie",
        "blad",
        "wylaczony"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "etykieta",
          "type": "string",
          "required": true,
          "default": "Adres e-mail",
          "description": "Widoczna nazwa pola nad ramką; ta sama treść jest nazwą dostępną dla czytnika ekranu."
        },
        {
          "name": "wartosc",
          "type": "string",
          "required": false,
          "default": "kontakt@domena.pl",
          "description": "Aktualna treść pola; próbka renderu pokazuje wartość domyślną."
        },
        {
          "name": "tekstZastepczy",
          "type": "string",
          "required": false,
          "default": "np. nazwa@domena.pl",
          "description": "Podpowiedź widoczna w pustym polu; znika po pierwszym znaku i nigdy nie zastępuje etykiety."
        },
        {
          "name": "tekstPomocy",
          "type": "string",
          "required": false,
          "default": "Na ten adres wyślemy potwierdzenie.",
          "description": "Stała wskazówka pod ramką mówiąca, do czego posłuży wpisany adres; w stanie błędu ustępuje miejsca komunikatowi."
        },
        {
          "name": "komunikatBledu",
          "type": "string",
          "required": false,
          "default": "Podaj adres w formacie nazwa@domena.pl.",
          "description": "Treść pokazywana pod ramką, gdy walidacja odrzuci wartość."
        },
        {
          "name": "typ",
          "type": "enum",
          "enum": [
            "tekst",
            "email",
            "haslo",
            "telefon"
          ],
          "required": false,
          "default": "email",
          "description": "Rodzaj treści; wybiera klawiaturę ekranową na urządzeniu dotykowym i podpowiedź autouzupełniania."
        },
        {
          "name": "maksymalnaDlugosc",
          "type": "number",
          "required": false,
          "default": 120,
          "description": "Twardy limit znaków; znaki ponad limit są odrzucane bez zmiany wartości."
        },
        {
          "name": "wymagane",
          "type": "boolean",
          "required": false,
          "default": false,
          "description": "Dopisuje gwiazdkę przy etykiecie i włącza sprawdzenie pustej wartości przy wysyłce formularza."
        },
        {
          "name": "tylkoDoOdczytu",
          "type": "boolean",
          "required": false,
          "default": false,
          "description": "Blokuje zmianę wartości, ale zostawia ją do zaznaczenia i skopiowania; w odróżnieniu od wyłączenia pole nadal przyjmuje skupienie i jedzie z formularzem przy wysyłce."
        },
        {
          "name": "stan",
          "type": "enum",
          "enum": [
            "zwykly",
            "skupienie",
            "blad",
            "wylaczony"
          ],
          "required": false,
          "default": "zwykly",
          "description": "Wygląd wymuszony z zewnątrz na potrzeby podglądu wariantu; w działającym formularzu wynika ze skupienia i wyniku walidacji, a nie z tej właściwości."
        }
      ],
      "states": {
        "spoczynek": "Ramka w kolorze neutralnym, etykieta nad polem, tekst pomocy pod polem; wartość i podpowiedź zastępcza w tej samej linii bazowej.",
        "najechanie": "Obwódka ciemnieje o jeden krok, wskaźnik myszy zmienia się w belkę tekstową; tło ramki bez zmian.",
        "skupienie": "Kursor tekstowy miga w polu, obwódka przechodzi w kolor skupienia i grubieje, wokół ramki pojawia się pierścień skupienia; tekst pomocy pozostaje widoczny.",
        "blad": "Obwódka i tekst pod polem w kolorze błędu, komunikat błędu zajmuje miejsce tekstu pomocy; wpisana wartość zostaje w polu i nie jest czyszczona.",
        "wylaczony": "Pole nie przyjmuje wpisu ani skupienia, znika z kolejności Tab; tło ramki wycisza się, a etykieta, wartość i tekst pomocy bledną do koloru wyłączonego.",
        "tylko-do-odczytu": "Wartość można zaznaczyć i skopiować, ale nie zmienić; pole nadal przyjmuje skupienie i zostaje w kolejności Tab, obwódka schodzi do subtelnej, tło wycisza się, a wartość przechodzi w kolor drugorzędny."
      },
      "behavior": {
        "walidacja": "Sprawdzenie uruchamia się po opuszczeniu pola; po pierwszym błędzie powtarza się przy każdym naciśnięciu klawisza, żeby poprawka zdejmowała błąd od razu.",
        "przycinanieSpacji": "Białe znaki z początku i końca są usuwane przy zatwierdzeniu, nigdy w trakcie pisania — inaczej nie dałoby się wpisać spacji w środku.",
        "limitZnakow": "Po osiągnięciu maksymalnej długości kolejne znaki są odrzucane, a wklejony nadmiar obcinany; licznik znaków nie jest pokazywany.",
        "autouzupelnianie": "Pole przekazuje przeglądarce podpowiedź autouzupełniania wynikającą z właściwości typ (dla wartości email — adres poczty).",
        "zachowanieWartosci": "Przejście w stan błędu ani wyłączenia nie kasuje wpisanej treści; czyszczenie należy do formularza, nie do pola."
      },
      "a11y": {
        "rola": "textbox — natywny element input, bez nadpisywania roli atrybutem role.",
        "powiazanieEtykiety": "Etykieta ma atrybut for wskazujący identyfikator pola; kliknięcie w etykietę przenosi kursor do pola.",
        "klawiatura": "Tab wprowadza i wyprowadza skupienie, Home i End przesuwają kursor na początek i koniec treści, Escape nie czyści wartości.",
        "czytnikEkranu": "Tekst pomocy podpięty przez aria-describedby; w stanie błędu pole dostaje aria-invalid=true, a komunikat trafia do tego samego opisu, więc jest czytany po nazwie pola.",
        "kontrast": "Obwódka ramki utrzymuje 3:1 wobec tła strony, wpisana wartość 4.5:1; sam kolor obwódki nigdy nie jest jedynym nośnikiem informacji o błędzie — towarzyszy mu komunikat tekstowy."
      },
      "tokenConsumption": [
        "rdzen.semantic.odstep-ciasny",
        "rdzen.funkcjonalne.formularz-etykieta",
        "rdzen.semantic.typografia-podpis",
        "rdzen.typografia.grubosc-srednia",
        "rdzen.typografia.wysokosc-zwarta",
        "rdzen.komponent.pole-tlo",
        "rdzen.komponent.pole-obwodka",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.semantic.promien-interakcja",
        "rdzen.semantic.odstep-zwykly",
        "rdzen.rozmiar.odstep-500",
        "rdzen.komponent.pole-tresc",
        "rdzen.semantic.typografia-tresc",
        "rdzen.typografia.rodzina-podstawowa",
        "rdzen.typografia.wysokosc-zwykla",
        "rdzen.funkcjonalne.formularz-pomoc",
        "rdzen.typografia.rozmiar-drobny",
        "rdzen.komponent.pole-obwodka-skupienie",
        "rdzen.rozmiar.obwodka-srednia",
        "rdzen.semantic.obwodka-skupienie",
        "rdzen.semantic.obwodka-blad",
        "rdzen.funkcjonalne.formularz-blad",
        "rdzen.semantic.tlo-wyciszone",
        "rdzen.semantic.obwodka-subtelna",
        "rdzen.semantic.tekst-wylaczony",
        "rdzen.semantic.obwodka-wyrazna",
        "rdzen.semantic.tekst-drugorzedny"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "stack",
          "children": [
            "etykieta",
            "ramka",
            "pomoc"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            }
          }
        },
        {
          "id": "etykieta",
          "element": "text",
          "textFrom": "props.etykieta.default",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.formularz-etykieta"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwarta"
            }
          }
        },
        {
          "id": "ramka",
          "element": "row",
          "children": [
            "wartosc"
          ],
          "bind": {
            "background": {
              "token": "rdzen.komponent.pole-tlo"
            },
            "borderColor": {
              "token": "rdzen.komponent.pole-obwodka"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-500"
            },
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            }
          }
        },
        {
          "id": "wartosc",
          "element": "input",
          "textFrom": "props.wartosc.default",
          "bind": {
            "color": {
              "token": "rdzen.komponent.pole-tresc"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwykla"
            }
          }
        },
        {
          "id": "pomoc",
          "element": "text",
          "textFrom": "props.tekstPomocy.default",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.formularz-pomoc"
            },
            "fontSize": {
              "token": "rdzen.typografia.rozmiar-drobny"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwarta"
            }
          }
        }
      ],
      "variants": {
        "stan": {
          "skupienie": {
            "ramka": {
              "borderColor": {
                "token": "rdzen.komponent.pole-obwodka-skupienie"
              },
              "borderWidth": {
                "token": "rdzen.rozmiar.obwodka-srednia"
              },
              "outlineColor": {
                "token": "rdzen.semantic.obwodka-skupienie"
              },
              "outlineWidth": {
                "token": "rdzen.rozmiar.obwodka-srednia"
              }
            }
          },
          "blad": {
            "ramka": {
              "borderColor": {
                "token": "rdzen.semantic.obwodka-blad"
              },
              "borderWidth": {
                "token": "rdzen.rozmiar.obwodka-srednia"
              }
            },
            "pomoc": {
              "color": {
                "token": "rdzen.funkcjonalne.formularz-blad"
              }
            }
          },
          "wylaczony": {
            "ramka": {
              "background": {
                "token": "rdzen.semantic.tlo-wyciszone"
              },
              "borderColor": {
                "token": "rdzen.semantic.obwodka-subtelna"
              }
            },
            "wartosc": {
              "color": {
                "token": "rdzen.semantic.tekst-wylaczony"
              }
            },
            "etykieta": {
              "color": {
                "token": "rdzen.semantic.tekst-wylaczony"
              }
            },
            "pomoc": {
              "color": {
                "token": "rdzen.semantic.tekst-wylaczony"
              }
            }
          }
        }
      },
      "states": {
        "najechanie": {
          "ramka": {
            "borderColor": {
              "token": "rdzen.semantic.obwodka-wyrazna"
            }
          }
        },
        "skupienie": {
          "ramka": {
            "borderColor": {
              "token": "rdzen.komponent.pole-obwodka-skupienie"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            },
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            }
          }
        },
        "blad": {
          "ramka": {
            "borderColor": {
              "token": "rdzen.semantic.obwodka-blad"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            }
          },
          "pomoc": {
            "color": {
              "token": "rdzen.funkcjonalne.formularz-blad"
            }
          }
        },
        "wylaczony": {
          "ramka": {
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            }
          },
          "wartosc": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          },
          "etykieta": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          },
          "pomoc": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          }
        },
        "tylko-do-odczytu": {
          "ramka": {
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            }
          },
          "wartosc": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            }
          }
        }
      }
    }
  },
  "pole-liczbowe": {
    "osie": {
      "stan": [
        "zwykly",
        "blad"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "etykieta",
          "type": "string",
          "required": true,
          "default": "Liczba sztuk",
          "description": "Nazwa pola nad ramką; wraz z jednostką tworzy pełny opis odczytywany przez czytnik ekranu."
        },
        {
          "name": "wartosc",
          "type": "number",
          "required": false,
          "default": 12,
          "description": "Bieżąca liczba w polu; próbka renderu pokazuje wartość domyślną."
        },
        {
          "name": "minimum",
          "type": "number",
          "required": false,
          "default": 1,
          "description": "Dolna granica zakresu; poniżej niej przycisk zmniejszania przestaje reagować."
        },
        {
          "name": "maksimum",
          "type": "number",
          "required": false,
          "default": 99,
          "description": "Górna granica zakresu; powyżej niej przycisk zwiększania przestaje reagować."
        },
        {
          "name": "krok",
          "type": "number",
          "required": false,
          "default": 1,
          "description": "Wartość pojedynczej zmiany przyciskiem i strzałką; wyznacza też dopuszczalną siatkę wartości."
        },
        {
          "name": "jednostka",
          "type": "string",
          "required": false,
          "default": "szt.",
          "description": "Skrót jednostki dopisywany do odczytu wartości dla czytnika ekranu; nie jest częścią wpisu ani wysyłanej wartości."
        },
        {
          "name": "tekstPomocy",
          "type": "string",
          "required": false,
          "default": "Zakres od 1 do 99, krok co 1.",
          "description": "Wskazówka pod polem podająca zakres i krok, żeby nie trzeba było ich odkrywać próbą."
        },
        {
          "name": "komunikatBledu",
          "type": "string",
          "required": false,
          "default": "Wartość musi mieścić się w zakresie od 1 do 99.",
          "description": "Treść pokazywana pod polem, gdy wpisana liczba wypada poza zakres; liczba spoza siatki kroku nie zapala błędu, tylko zostaje zaokrąglona."
        },
        {
          "name": "stan",
          "type": "enum",
          "enum": [
            "zwykly",
            "blad"
          ],
          "required": false,
          "default": "zwykly",
          "description": "Wygląd wymuszony z zewnątrz na potrzeby podglądu wariantu; w działającym formularzu wartość „blad” zapala sprawdzenie zakresu, a nie ta właściwość."
        }
      ],
      "states": {
        "spoczynek": "Liczba wyrównana do lewej krawędzi wpisu, dwa przyciski kroku przy prawej krawędzi ramki, obwódka neutralna.",
        "skupienie": "Kursor w polu liczby, obwódka w kolorze skupienia z pierścieniem wokół całej ramki razem z przyciskami kroku — pierścień nie otacza samych przycisków osobno.",
        "granica-zakresu": "Wartość osiągnęła minimum albo maksimum: przycisk prowadzący poza zakres gaśnie do połowy krycia i przestaje reagować na kliknięcie, drugi działa dalej.",
        "blad": "Obwódka i tekst pod polem w kolorze błędu; liczba spoza zakresu zostaje w polu, żeby dało się ją poprawić zamiast wpisywać od nowa.",
        "wylaczony": "Pole i oba przyciski kroku nie reagują ani na wskaźnik, ani na klawiaturę; tło ramki wycisza się, a etykieta, liczba, znaki plus i minus oraz tekst pomocy bledną do koloru wyłączonego."
      },
      "behavior": {
        "krok": "Kliknięcie plus lub minus zmienia wartość o krok i przycina wynik do zakresu; przytrzymanie przycisku powtarza krok po 500 ms z narastającą częstotliwością.",
        "dozwoloneZnaki": "Pole przyjmuje cyfry, znak minus wyłącznie na pierwszej pozycji i jeden separator dziesiętny; pozostałe znaki nie trafiają do wartości.",
        "wklejanie": "Wklejony tekst jest oczyszczany ze spacji i separatorów tysięcy, a potem sprawdzany wobec zakresu i kroku — dopiero wynik trafia do pola.",
        "kolkoMyszy": "Przewijanie kółkiem nad polem nie zmienia wartości; strona przewija się normalnie, więc przypadkowy ruch nie psuje wpisanej liczby.",
        "zaokraglenieDoKroku": "Wartość spoza siatki kroku jest przy zatwierdzeniu zaokrąglana do najbliższej dozwolonej, a nie odrzucana; błąd zostaje zarezerwowany dla wyjścia poza zakres."
      },
      "a11y": {
        "rola": "spinbutton — pole liczbowe z aria-valuemin, aria-valuemax i aria-valuenow odzwierciedlającymi zakres i bieżącą wartość.",
        "klawiatura": "Strzałka w górę i w dół zmienia wartość o krok, PageUp i PageDown o dziesięć kroków, Home ustawia minimum, End maksimum.",
        "przyciskiKroku": "Przyciski plus i minus są pomijane w kolejności Tab, bo klawiatura obsługuje krok strzałkami; mają nazwy dostępne „Zwiększ o 1” i „Zmniejsz o 1” podstawiające bieżący krok.",
        "czytnikEkranu": "Po zmianie odczytywana jest nowa liczba wraz z jednostką z aria-valuetext (na przykład „12 szt.”); dojście do granicy zakresu ogłasza komunikat w obszarze aria-live=polite.",
        "obszarDotyku": "Każdy przycisk kroku ma obszar dotyku co najmniej 44 na 44 piksele, rozciągnięty poza rysowany kwadrat, żeby nie zmieniać wysokości ramki."
      },
      "tokenConsumption": [
        "rdzen.semantic.odstep-ciasny",
        "rdzen.funkcjonalne.formularz-etykieta",
        "rdzen.semantic.typografia-podpis",
        "rdzen.typografia.grubosc-srednia",
        "rdzen.typografia.wysokosc-zwarta",
        "rdzen.komponent.pole-tlo",
        "rdzen.komponent.pole-obwodka",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.semantic.promien-interakcja",
        "rdzen.semantic.odstep-przylegly",
        "rdzen.rozmiar.odstep-500",
        "rdzen.komponent.pole-tresc",
        "rdzen.semantic.typografia-tresc",
        "rdzen.typografia.rodzina-o-stalej-szerokosci",
        "rdzen.typografia.wysokosc-zwykla",
        "rdzen.semantic.tlo-wyciszone",
        "rdzen.rozmiar.promien-maly",
        "rdzen.rozmiar.ikona-duzy",
        "rdzen.rozmiar.ikona-maly",
        "rdzen.semantic.tekst-podstawowy",
        "rdzen.funkcjonalne.formularz-pomoc",
        "rdzen.typografia.rozmiar-drobny",
        "rdzen.semantic.obwodka-blad",
        "rdzen.rozmiar.obwodka-srednia",
        "rdzen.funkcjonalne.formularz-blad",
        "rdzen.komponent.pole-obwodka-skupienie",
        "rdzen.semantic.obwodka-skupienie",
        "rdzen.semantic.obwodka-subtelna",
        "rdzen.semantic.tekst-wylaczony",
        "rdzen.krycie.polowa"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "stack",
          "children": [
            "etykieta",
            "ramka",
            "pomoc"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            }
          }
        },
        {
          "id": "etykieta",
          "element": "text",
          "textFrom": "props.etykieta.default",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.formularz-etykieta"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwarta"
            }
          }
        },
        {
          "id": "ramka",
          "element": "row",
          "children": [
            "wartosc",
            "krokMinus",
            "krokPlus"
          ],
          "bind": {
            "background": {
              "token": "rdzen.komponent.pole-tlo"
            },
            "borderColor": {
              "token": "rdzen.komponent.pole-obwodka"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-przylegly"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-500"
            },
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            }
          }
        },
        {
          "id": "wartosc",
          "element": "input",
          "textFrom": "props.wartosc.default",
          "bind": {
            "color": {
              "token": "rdzen.komponent.pole-tresc"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-o-stalej-szerokosci"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwykla"
            }
          }
        },
        {
          "id": "krokMinus",
          "element": "box",
          "children": [
            "ikonaMinus"
          ],
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            },
            "radius": {
              "token": "rdzen.rozmiar.promien-maly"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-duzy"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-duzy"
            }
          }
        },
        {
          "id": "ikonaMinus",
          "element": "icon",
          "iconName": "minus",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-maly"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-maly"
            }
          }
        },
        {
          "id": "krokPlus",
          "element": "box",
          "children": [
            "ikonaPlus"
          ],
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            },
            "radius": {
              "token": "rdzen.rozmiar.promien-maly"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-duzy"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-duzy"
            }
          }
        },
        {
          "id": "ikonaPlus",
          "element": "icon",
          "iconName": "plus",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-maly"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-maly"
            }
          }
        },
        {
          "id": "pomoc",
          "element": "text",
          "textFrom": "props.tekstPomocy.default",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.formularz-pomoc"
            },
            "fontSize": {
              "token": "rdzen.typografia.rozmiar-drobny"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwarta"
            }
          }
        }
      ],
      "variants": {
        "stan": {
          "blad": {
            "ramka": {
              "borderColor": {
                "token": "rdzen.semantic.obwodka-blad"
              },
              "borderWidth": {
                "token": "rdzen.rozmiar.obwodka-srednia"
              }
            },
            "pomoc": {
              "color": {
                "token": "rdzen.funkcjonalne.formularz-blad"
              }
            }
          }
        }
      },
      "states": {
        "skupienie": {
          "ramka": {
            "borderColor": {
              "token": "rdzen.komponent.pole-obwodka-skupienie"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            },
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            }
          }
        },
        "granica-zakresu": {
          "krokMinus": {
            "opacity": {
              "token": "rdzen.krycie.polowa"
            }
          }
        },
        "blad": {
          "ramka": {
            "borderColor": {
              "token": "rdzen.semantic.obwodka-blad"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            }
          },
          "pomoc": {
            "color": {
              "token": "rdzen.funkcjonalne.formularz-blad"
            }
          }
        },
        "wylaczony": {
          "ramka": {
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            }
          },
          "etykieta": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          },
          "wartosc": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          },
          "ikonaMinus": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          },
          "ikonaPlus": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          },
          "pomoc": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          }
        }
      }
    }
  },
  "pole-wyboru": {
    "osie": {
      "stan": [
        "zaznaczone",
        "odznaczone",
        "nieokreslone"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "etykieta",
          "type": "string",
          "required": true,
          "default": "Zapamiętaj ten wybór",
          "description": "Treść przy kwadracie; cała jest obszarem klikalnym przełączającym pole."
        },
        {
          "name": "tekstPomocy",
          "type": "string",
          "required": false,
          "default": "Ustawienie zapiszemy w tej przeglądarce.",
          "description": "Doprecyzowanie konsekwencji zaznaczenia, pod etykietą, mniejszym stopniem pisma."
        },
        {
          "name": "komunikatBledu",
          "type": "string",
          "required": false,
          "default": "Zaznacz to pole, aby przejść dalej.",
          "description": "Treść zajmująca miejsce tekstu pomocy, gdy formularz wysłano bez zaznaczenia pola wymaganego."
        },
        {
          "name": "stan",
          "type": "enum",
          "enum": [
            "zaznaczone",
            "odznaczone",
            "nieokreslone"
          ],
          "required": false,
          "default": "odznaczone",
          "description": "Zaznaczenie pola; wartość „nieokreslone” ustawia wyłącznie pole nadrzędne grupy."
        },
        {
          "name": "wymagane",
          "type": "boolean",
          "required": false,
          "default": false,
          "description": "Wymusza zaznaczenie przed wysłaniem formularza — typowe dla zgód, których nie wolno domyślnie zaznaczać."
        },
        {
          "name": "nazwaGrupy",
          "type": "string",
          "required": false,
          "default": "zgody",
          "description": "Wspólna nazwa pól w grupie; po niej pole nadrzędne zlicza zaznaczone dzieci."
        }
      ],
      "states": {
        "spoczynek": "Pusty kwadrat z obwódką po lewej, etykieta i tekst pomocy po prawej, wyrównane do górnej krawędzi kwadratu.",
        "najechanie": "Obwódka kwadratu ciemnieje; wypełnienie kwadratu zaznaczonego pozostaje bez zmian, żeby nie mylić najechania z odznaczeniem.",
        "skupienie": "Pierścień skupienia wokół samego kwadratu, nie wokół etykiety — dzięki temu widać, który element grupy jest aktywny.",
        "blad": "Obwódka kwadratu w kolorze błędu, a komunikat błędu zajmuje miejsce tekstu pomocy pod etykietą; dotyczy pola wymaganego, które nie zostało zaznaczone przed wysyłką.",
        "wylaczony": "Kwadrat i etykieta nie reagują na kliknięcie ani spację, pole wypada z kolejności Tab; kwadrat zachowuje znak zaznaczenia, ale wypełnienie schodzi do wyciszonego, a sam znak do koloru wyłączonego, żeby ptaszek nie zniknął na jasnym tle."
      },
      "behavior": {
        "przelaczanie": "Kliknięcie przełącza między „zaznaczone” i „odznaczone”; ze stanu „nieokreslone” pierwsze kliknięcie zawsze prowadzi do „zaznaczone”, nigdy z powrotem do „nieokreslone”.",
        "grupa": "Pole nadrzędne liczy zaznaczone dzieci: wszystkie — „zaznaczone”, część — „nieokreslone”, żadne — „odznaczone”; kliknięcie nadrzędnego zaznacza lub odznacza całą grupę naraz.",
        "obszarKlikalny": "Klikalny jest kwadrat razem z etykietą i tekstem pomocy; kliknięcie w odstęp między nimi też przełącza pole.",
        "walidacja": "Pole wymagane zgłasza błąd dopiero przy próbie wysłania formularza, nie zaraz po odznaczeniu — inaczej każde rozmyślenie się dawałoby czerwony komunikat.",
        "brakStanuPosredniego": "Zaznaczenie nie ma stanu ładowania: zmiana zapisuje się razem z formularzem, a nie natychmiast po kliknięciu."
      },
      "a11y": {
        "rola": "checkbox; stan nieokreślony wyrażony przez aria-checked=mixed, nie przez brak atrybutu.",
        "klawiatura": "Spacja przełącza zaznaczenie; Enter nie przełącza pola i nie wysyła formularza z jego pozycji.",
        "powiazanieEtykiety": "Etykieta i tekst pomocy leżą wewnątrz elementu label powiązanego z polem, więc czytnik odczytuje je jako jedną nazwę i opis.",
        "czytnikEkranu": "Kolejność odczytu: etykieta, potem stan (zaznaczone, niezaznaczone albo częściowo zaznaczone), na końcu tekst pomocy z aria-describedby.",
        "obszarDotyku": "Pole reaguje w prostokącie co najmniej 44 na 44 piksele wokół kwadratu, mimo że rysowany kwadrat jest mniejszy."
      },
      "tokenConsumption": [
        "rdzen.semantic.odstep-ciasny",
        "rdzen.rozmiar.ikona-sredni",
        "rdzen.komponent.pole-tlo",
        "rdzen.komponent.pole-obwodka",
        "rdzen.rozmiar.obwodka-srednia",
        "rdzen.rozmiar.promien-maly",
        "rdzen.semantic.tekst-odwrocony",
        "rdzen.rozmiar.odstep-000",
        "rdzen.rozmiar.ikona-maly",
        "rdzen.krycie.przezroczyste",
        "rdzen.semantic.odstep-przylegly",
        "rdzen.funkcjonalne.formularz-etykieta",
        "rdzen.semantic.typografia-tresc",
        "rdzen.typografia.wysokosc-zwarta",
        "rdzen.funkcjonalne.formularz-pomoc",
        "rdzen.typografia.rozmiar-drobny",
        "rdzen.semantic.akcja-podstawowa",
        "rdzen.krycie.pelne",
        "rdzen.semantic.obwodka-wyrazna",
        "rdzen.semantic.obwodka-skupienie",
        "rdzen.semantic.obwodka-blad",
        "rdzen.funkcjonalne.formularz-blad",
        "rdzen.semantic.tlo-wyciszone",
        "rdzen.semantic.obwodka-subtelna",
        "rdzen.semantic.tekst-wylaczony"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "row",
          "children": [
            "kwadrat",
            "opisy"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            }
          }
        },
        {
          "id": "kwadrat",
          "element": "box",
          "children": [
            "ptaszek",
            "kreska"
          ],
          "bind": {
            "width": {
              "token": "rdzen.rozmiar.ikona-sredni"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-sredni"
            },
            "background": {
              "token": "rdzen.komponent.pole-tlo"
            },
            "borderColor": {
              "token": "rdzen.komponent.pole-obwodka"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            },
            "radius": {
              "token": "rdzen.rozmiar.promien-maly"
            }
          }
        },
        {
          "id": "ptaszek",
          "element": "icon",
          "iconName": "ptaszek",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-odwrocony"
            },
            "width": {
              "token": "rdzen.rozmiar.odstep-000"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-maly"
            },
            "opacity": {
              "token": "rdzen.krycie.przezroczyste"
            }
          }
        },
        {
          "id": "kreska",
          "element": "icon",
          "iconName": "minus",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-odwrocony"
            },
            "width": {
              "token": "rdzen.rozmiar.odstep-000"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-maly"
            },
            "opacity": {
              "token": "rdzen.krycie.przezroczyste"
            }
          }
        },
        {
          "id": "opisy",
          "element": "stack",
          "children": [
            "etykieta",
            "pomoc"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-przylegly"
            }
          }
        },
        {
          "id": "etykieta",
          "element": "text",
          "textFrom": "props.etykieta.default",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.formularz-etykieta"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwarta"
            }
          }
        },
        {
          "id": "pomoc",
          "element": "text",
          "textFrom": "props.tekstPomocy.default",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.formularz-pomoc"
            },
            "fontSize": {
              "token": "rdzen.typografia.rozmiar-drobny"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwarta"
            }
          }
        }
      ],
      "variants": {
        "stan": {
          "zaznaczone": {
            "kwadrat": {
              "background": {
                "token": "rdzen.semantic.akcja-podstawowa"
              },
              "borderColor": {
                "token": "rdzen.semantic.akcja-podstawowa"
              }
            },
            "ptaszek": {
              "width": {
                "token": "rdzen.rozmiar.ikona-maly"
              },
              "opacity": {
                "token": "rdzen.krycie.pelne"
              }
            }
          },
          "nieokreslone": {
            "kwadrat": {
              "background": {
                "token": "rdzen.semantic.akcja-podstawowa"
              },
              "borderColor": {
                "token": "rdzen.semantic.akcja-podstawowa"
              }
            },
            "kreska": {
              "width": {
                "token": "rdzen.rozmiar.ikona-maly"
              },
              "opacity": {
                "token": "rdzen.krycie.pelne"
              }
            }
          }
        }
      },
      "states": {
        "najechanie": {
          "kwadrat": {
            "borderColor": {
              "token": "rdzen.semantic.obwodka-wyrazna"
            }
          }
        },
        "skupienie": {
          "kwadrat": {
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            }
          }
        },
        "blad": {
          "kwadrat": {
            "borderColor": {
              "token": "rdzen.semantic.obwodka-blad"
            }
          },
          "pomoc": {
            "color": {
              "token": "rdzen.funkcjonalne.formularz-blad"
            }
          }
        },
        "wylaczony": {
          "kwadrat": {
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            }
          },
          "ptaszek": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          },
          "kreska": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          },
          "etykieta": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          },
          "pomoc": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          }
        }
      }
    }
  },
  "pole-daty": {
    "osie": {
      "stan": [
        "zwykly",
        "blad"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "etykieta",
          "type": "string",
          "required": true,
          "default": "Data wyjazdu",
          "description": "Nazwa pola nad ramką; przy dwóch polach zakresu rozróżnia datę początkową i końcową."
        },
        {
          "name": "wartosc",
          "type": "string",
          "required": false,
          "default": "12.09.2026",
          "description": "Data w formacie dd.mm.rrrr; próbka renderu pokazuje wartość domyślną."
        },
        {
          "name": "dataMin",
          "type": "string",
          "required": false,
          "default": "07.08.2026",
          "description": "Najwcześniejsza data do wyboru; wcześniejsze dni są w kalendarzu nieklikalne."
        },
        {
          "name": "dataMax",
          "type": "string",
          "required": false,
          "default": "07.08.2027",
          "description": "Najpóźniejsza data do wyboru; kalendarz nie pozwala przejść do miesięcy za tą granicą."
        },
        {
          "name": "pierwszyDzienTygodnia",
          "type": "enum",
          "enum": [
            "poniedzialek",
            "niedziela"
          ],
          "required": false,
          "default": "poniedzialek",
          "description": "Dzień otwierający kolumny siatki kalendarza; wynika z ustawień języka, nie z preferencji autora widoku."
        },
        {
          "name": "tekstPomocy",
          "type": "string",
          "required": false,
          "default": "Format dd.mm.rrrr, nie wcześniej niż dziś.",
          "description": "Wskazówka pod polem podająca format wpisu i granicę zakresu."
        },
        {
          "name": "komunikatBledu",
          "type": "string",
          "required": false,
          "default": "Wybierz datę z zakresu od dziś do 07.08.2027.",
          "description": "Treść pod polem, gdy wpisana data nie istnieje albo wypada poza zakres."
        },
        {
          "name": "stan",
          "type": "enum",
          "enum": [
            "zwykly",
            "blad"
          ],
          "required": false,
          "default": "zwykly",
          "description": "Wygląd wymuszony z zewnątrz na potrzeby podglądu wariantu; w działającym formularzu wartość „blad” zapala sprawdzenie istnienia daty i jej zakresu."
        }
      ],
      "states": {
        "spoczynek": "Data w polu pismem o stałej szerokości, ikona kalendarza przy prawej krawędzi ramki, obwódka neutralna.",
        "skupienie": "Kursor stoi w jednym z segmentów daty (dzień, miesiąc albo rok), segment jest podświetlony, obwódka w kolorze skupienia z pierścieniem wokół ramki.",
        "otwarty-kalendarz": "Kalendarz rozwinięty pod polem, ikona przyjmuje kolor akcji, obwódka pola zostaje w kolorze skupienia; pole nie traci wpisanej wartości.",
        "blad": "Obwódka, ikona i tekst pod polem w kolorze błędu; niepoprawna data zostaje w polu, więc widać, co dokładnie wymaga poprawki.",
        "wylaczony": "Ani wpis, ani otwarcie kalendarza nie są możliwe; tło ramki wycisza się, a etykieta, data, ikona i tekst pomocy bledną do koloru wyłączonego, pole wypada z kolejności Tab."
      },
      "behavior": {
        "maska": "Kropki wstawiają się same po dwóch cyfrach dnia i po dwóch cyfrach miesiąca; kasowanie przechodzi przez separator bez zatrzymania na nim.",
        "walidacjaZakresu": "Data spoza dozwolonego zakresu zostaje w polu i zapala błąd zamiast być po cichu przyciętą do granicy zakresu.",
        "niedostepneDni": "Dni poza zakresem są w kalendarzu nieklikalne i pomijane przy przechodzeniu strzałkami, a nie tylko wyszarzone.",
        "rokDwucyfrowy": "Wpis dwucyfrowego roku jest uzupełniany do bieżącego stulecia; wynik pokazuje się w polu od razu, żeby dało się go poprawić.",
        "wpisBezKalendarza": "Całą datę można wpisać z klawiatury bez otwierania kalendarza — kalendarz jest ułatwieniem, nie jedyną drogą do wartości.",
        "dataNieistniejaca": "Dzień przekraczający długość miesiąca (na przykład 31.04) nie jest przesuwany na kolejny miesiąc, tylko zgłaszany jako błąd."
      },
      "a11y": {
        "rola": "Pole tekstowe z maską daty; ikona kalendarza to przycisk z aria-haspopup=dialog i aria-expanded.",
        "klawiatura": "Strzałki w górę i w dół zmieniają segment pod kursorem, strzałki w bok przechodzą między segmentami; Alt ze strzałką w dół otwiera kalendarz, Escape zamyka go i wraca skupieniem do pola.",
        "kalendarz": "W otwartym kalendarzu strzałki przesuwają wybór o dzień, PageUp i PageDown o miesiąc; pułapka skupienia obejmuje nagłówek miesiąca i siatkę dni, a nie całą stronę.",
        "czytnikEkranu": "Data odczytywana słownie („12 września 2026”), nie jako ciąg cyfr; po zamknięciu kalendarza wybrana data jest ogłaszana w obszarze aria-live=polite.",
        "siatkaDni": "Siatka kalendarza to tabela z nagłówkami dni tygodnia; nazwa dnia jest pełna w atrybucie dostępnym, mimo że wizualnie widać dwuliterowy skrót."
      },
      "tokenConsumption": [
        "rdzen.semantic.odstep-ciasny",
        "rdzen.funkcjonalne.formularz-etykieta",
        "rdzen.semantic.typografia-podpis",
        "rdzen.typografia.grubosc-srednia",
        "rdzen.typografia.wysokosc-zwarta",
        "rdzen.komponent.pole-tlo",
        "rdzen.komponent.pole-obwodka",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.semantic.promien-interakcja",
        "rdzen.semantic.odstep-zwykly",
        "rdzen.rozmiar.odstep-500",
        "rdzen.komponent.pole-tresc",
        "rdzen.semantic.typografia-tresc",
        "rdzen.typografia.rodzina-o-stalej-szerokosci",
        "rdzen.typografia.wysokosc-zwykla",
        "rdzen.semantic.tekst-drugorzedny",
        "rdzen.rozmiar.ikona-sredni",
        "rdzen.funkcjonalne.formularz-pomoc",
        "rdzen.typografia.rozmiar-drobny",
        "rdzen.semantic.obwodka-blad",
        "rdzen.rozmiar.obwodka-srednia",
        "rdzen.funkcjonalne.formularz-blad",
        "rdzen.semantic.tekst-negatywny",
        "rdzen.komponent.pole-obwodka-skupienie",
        "rdzen.semantic.obwodka-skupienie",
        "rdzen.semantic.akcja-podstawowa",
        "rdzen.semantic.tlo-wyciszone",
        "rdzen.semantic.obwodka-subtelna",
        "rdzen.semantic.tekst-wylaczony"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "stack",
          "children": [
            "etykieta",
            "ramka",
            "pomoc"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            }
          }
        },
        {
          "id": "etykieta",
          "element": "text",
          "textFrom": "props.etykieta.default",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.formularz-etykieta"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwarta"
            }
          }
        },
        {
          "id": "ramka",
          "element": "row",
          "children": [
            "wartosc",
            "ikonaKalendarz"
          ],
          "bind": {
            "background": {
              "token": "rdzen.komponent.pole-tlo"
            },
            "borderColor": {
              "token": "rdzen.komponent.pole-obwodka"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-500"
            },
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            }
          }
        },
        {
          "id": "wartosc",
          "element": "input",
          "textFrom": "props.wartosc.default",
          "bind": {
            "color": {
              "token": "rdzen.komponent.pole-tresc"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-o-stalej-szerokosci"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwykla"
            }
          }
        },
        {
          "id": "ikonaKalendarz",
          "element": "icon",
          "iconName": "kalendarz",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-sredni"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-sredni"
            }
          }
        },
        {
          "id": "pomoc",
          "element": "text",
          "textFrom": "props.tekstPomocy.default",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.formularz-pomoc"
            },
            "fontSize": {
              "token": "rdzen.typografia.rozmiar-drobny"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwarta"
            }
          }
        }
      ],
      "variants": {
        "stan": {
          "blad": {
            "ramka": {
              "borderColor": {
                "token": "rdzen.semantic.obwodka-blad"
              },
              "borderWidth": {
                "token": "rdzen.rozmiar.obwodka-srednia"
              }
            },
            "ikonaKalendarz": {
              "color": {
                "token": "rdzen.semantic.tekst-negatywny"
              }
            },
            "pomoc": {
              "color": {
                "token": "rdzen.funkcjonalne.formularz-blad"
              }
            }
          }
        }
      },
      "states": {
        "skupienie": {
          "ramka": {
            "borderColor": {
              "token": "rdzen.komponent.pole-obwodka-skupienie"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            },
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            }
          }
        },
        "otwarty-kalendarz": {
          "ramka": {
            "borderColor": {
              "token": "rdzen.komponent.pole-obwodka-skupienie"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            }
          },
          "ikonaKalendarz": {
            "color": {
              "token": "rdzen.semantic.akcja-podstawowa"
            }
          }
        },
        "blad": {
          "ramka": {
            "borderColor": {
              "token": "rdzen.semantic.obwodka-blad"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            }
          },
          "ikonaKalendarz": {
            "color": {
              "token": "rdzen.semantic.tekst-negatywny"
            }
          },
          "pomoc": {
            "color": {
              "token": "rdzen.funkcjonalne.formularz-blad"
            }
          }
        },
        "wylaczony": {
          "ramka": {
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            }
          },
          "etykieta": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          },
          "wartosc": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          },
          "ikonaKalendarz": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          },
          "pomoc": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          }
        }
      }
    }
  },
  "lista-rozwijana": {
    "osie": {
      "stan": [
        "zwykly",
        "otwarta",
        "blad"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "etykieta",
          "type": "string",
          "required": true,
          "default": "Kategoria zgłoszenia",
          "description": "Nazwa pola nad ramką; zostaje widoczna także po otwarciu listy."
        },
        {
          "name": "wybranaWartosc",
          "type": "string",
          "required": false,
          "default": "Awaria sprzętu",
          "description": "Etykieta wybranej pozycji pokazywana w zamkniętym polu; próbka renderu pokazuje wartość domyślną."
        },
        {
          "name": "tekstZastepczy",
          "type": "string",
          "required": false,
          "default": "Wybierz kategorię",
          "description": "Treść w polu, dopóki nic nie wybrano; ma kolor tekstu drugorzędnego, żeby nie udawała wyboru."
        },
        {
          "name": "liczbaPozycji",
          "type": "number",
          "required": false,
          "default": 12,
          "description": "Liczba pozycji na liście; od ośmiu włącznie nad listą pojawia się pole filtra."
        },
        {
          "name": "tekstPomocy",
          "type": "string",
          "required": false,
          "default": "Wpisz, aby zawęzić listę.",
          "description": "Wskazówka pod polem informująca o filtrowaniu; przy krótkich listach pomijana."
        },
        {
          "name": "komunikatBledu",
          "type": "string",
          "required": false,
          "default": "Wybierz jedną z pozycji listy.",
          "description": "Treść pod polem, gdy pole wymagane zostało wysłane bez wyboru."
        },
        {
          "name": "stan",
          "type": "enum",
          "enum": [
            "zwykly",
            "otwarta",
            "blad"
          ],
          "required": false,
          "default": "zwykly",
          "description": "Wygląd wymuszony z zewnątrz na potrzeby podglądu wariantu; normalnie wartość „otwarta” wynika z kliknięcia albo skrótu Alt ze strzałką w dół, a „blad” z wysyłki formularza bez wyboru."
        }
      ],
      "states": {
        "spoczynek": "Zamknięte pole z etykietą wybranej pozycji i strzałką w dół przy prawej krawędzi; lista nie zajmuje miejsca w układzie.",
        "najechanie": "Obwódka pola ciemnieje, strzałka bez zmian; najechanie nie otwiera listy, bo przypadkowy ruch myszą zasłaniałby treść pod polem.",
        "skupienie": "Obwódka w kolorze skupienia z pierścieniem wokół pola, grubość obwódki bez zmian, lista wciąż zamknięta — skupienie i otwarcie to dwie różne rzeczy.",
        "otwarta": "Strzałka odwraca się w górę i przyjmuje kolor akcji, obwódka pola grubieje i przechodzi w kolor skupienia, lista rozwija się pod polem na warstwie nakładki; skupienie zostaje w polu.",
        "blad": "Obwódka i tekst pod polem w kolorze błędu; wybrana wcześniej pozycja nie jest kasowana.",
        "wylaczony": "Pole nie otwiera listy ani nie przyjmuje skupienia; tło ramki wycisza się, a nazwa pola, wybrana pozycja, strzałka i tekst pomocy bledną do koloru wyłączonego."
      },
      "behavior": {
        "otwieranieZamykanie": "Kliknięcie w pole otwiera listę zakotwiczoną pod polem, a przy braku miejsca nad nim; kliknięcie poza obszarem zamyka listę bez zmiany wyboru.",
        "wybor": "Wybór pozycji zamyka listę, wstawia jej etykietę do pola i wraca skupieniem do pola, żeby Tab prowadził dalej po formularzu.",
        "filtr": "Filtr dopasowuje fragment w dowolnym miejscu etykiety, nie rozróżnia wielkości liter ani znaków diakrytycznych — „zgloszenie” znajduje „Zgłoszenie”.",
        "brakWynikow": "Gdy filtr nic nie zwraca, lista zostaje otwarta i pokazuje jeden nieklikalny wiersz „Brak pasujących pozycji”, zamiast zamykać się bez wyjaśnienia.",
        "przewijanie": "Lista pokazuje najwyżej osiem wierszy naraz, resztę przewija; przewijanie strony pod otwartą listą jest zablokowane, więc lista nie odkleja się od pola.",
        "szerokoscListy": "Lista ma szerokość pola i nie zwęża się do najdłuższej pozycji; dłuższe etykiety są zawijane do dwóch wierszy, a nie skracane wielokropkiem."
      },
      "a11y": {
        "rola": "combobox z aria-expanded i aria-controls wskazującym listę; lista ma rolę listbox, pozycje rolę option z aria-selected.",
        "klawiatura": "Alt ze strzałką w dół otwiera listę bez zmiany wyboru; przy zamkniętej liście same strzałki przestawiają wybór na sąsiednią pozycję, przy otwartej Enter zatwierdza podświetloną pozycję, Escape zamyka listę i przywraca poprzedni wybór, Home i End skaczą na pierwszą i ostatnią pozycję.",
        "wyszukiwanieLiterami": "Przy liście krótszej niż osiem pozycji naciśnięcie litery przenosi do pierwszej pasującej pozycji; od ośmiu pozycji litery trafiają do pola filtra.",
        "czytnikEkranu": "Skupienie zostaje w polu, aktywna pozycja wskazywana przez aria-activedescendant; po otwarciu odczytywana jest liczba pozycji, a po każdej zmianie filtra liczba wyników w obszarze aria-live=polite.",
        "kontrast": "Strzałka i obwódka pola trzymają 3:1 wobec tła; wybrana pozycja na liście jest oznaczona ptaszkiem, a nie samym wypełnieniem tła."
      },
      "tokenConsumption": [
        "rdzen.semantic.odstep-ciasny",
        "rdzen.funkcjonalne.formularz-etykieta",
        "rdzen.semantic.typografia-podpis",
        "rdzen.typografia.grubosc-srednia",
        "rdzen.typografia.wysokosc-zwarta",
        "rdzen.komponent.pole-tlo",
        "rdzen.komponent.pole-obwodka",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.semantic.promien-interakcja",
        "rdzen.semantic.odstep-zwykly",
        "rdzen.rozmiar.odstep-500",
        "rdzen.komponent.pole-tresc",
        "rdzen.semantic.typografia-tresc",
        "rdzen.typografia.rodzina-podstawowa",
        "rdzen.typografia.wysokosc-zwykla",
        "rdzen.semantic.tekst-drugorzedny",
        "rdzen.rozmiar.ikona-sredni",
        "rdzen.krycie.pelne",
        "rdzen.semantic.akcja-podstawowa",
        "rdzen.rozmiar.odstep-000",
        "rdzen.krycie.przezroczyste",
        "rdzen.funkcjonalne.formularz-pomoc",
        "rdzen.typografia.rozmiar-drobny",
        "rdzen.komponent.pole-obwodka-skupienie",
        "rdzen.rozmiar.obwodka-srednia",
        "rdzen.semantic.obwodka-blad",
        "rdzen.funkcjonalne.formularz-blad",
        "rdzen.semantic.obwodka-wyrazna",
        "rdzen.semantic.obwodka-skupienie",
        "rdzen.semantic.tlo-wyciszone",
        "rdzen.semantic.obwodka-subtelna",
        "rdzen.semantic.tekst-wylaczony"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "stack",
          "children": [
            "etykieta",
            "ramka",
            "pomoc"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            }
          }
        },
        {
          "id": "etykieta",
          "element": "text",
          "textFrom": "props.etykieta.default",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.formularz-etykieta"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwarta"
            }
          }
        },
        {
          "id": "ramka",
          "element": "row",
          "children": [
            "wartosc",
            "strzalkaDol",
            "strzalkaGora"
          ],
          "bind": {
            "background": {
              "token": "rdzen.komponent.pole-tlo"
            },
            "borderColor": {
              "token": "rdzen.komponent.pole-obwodka"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-500"
            },
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            }
          }
        },
        {
          "id": "wartosc",
          "element": "text",
          "textFrom": "props.wybranaWartosc.default",
          "bind": {
            "color": {
              "token": "rdzen.komponent.pole-tresc"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwykla"
            }
          }
        },
        {
          "id": "strzalkaDol",
          "element": "icon",
          "iconName": "strzalka-dol",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-sredni"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-sredni"
            },
            "opacity": {
              "token": "rdzen.krycie.pelne"
            }
          }
        },
        {
          "id": "strzalkaGora",
          "element": "icon",
          "iconName": "strzalka-gora",
          "bind": {
            "color": {
              "token": "rdzen.semantic.akcja-podstawowa"
            },
            "width": {
              "token": "rdzen.rozmiar.odstep-000"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-sredni"
            },
            "opacity": {
              "token": "rdzen.krycie.przezroczyste"
            }
          }
        },
        {
          "id": "pomoc",
          "element": "text",
          "textFrom": "props.tekstPomocy.default",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.formularz-pomoc"
            },
            "fontSize": {
              "token": "rdzen.typografia.rozmiar-drobny"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwarta"
            }
          }
        }
      ],
      "variants": {
        "stan": {
          "otwarta": {
            "ramka": {
              "borderColor": {
                "token": "rdzen.komponent.pole-obwodka-skupienie"
              },
              "borderWidth": {
                "token": "rdzen.rozmiar.obwodka-srednia"
              }
            },
            "strzalkaDol": {
              "width": {
                "token": "rdzen.rozmiar.odstep-000"
              },
              "opacity": {
                "token": "rdzen.krycie.przezroczyste"
              }
            },
            "strzalkaGora": {
              "width": {
                "token": "rdzen.rozmiar.ikona-sredni"
              },
              "opacity": {
                "token": "rdzen.krycie.pelne"
              }
            }
          },
          "blad": {
            "ramka": {
              "borderColor": {
                "token": "rdzen.semantic.obwodka-blad"
              },
              "borderWidth": {
                "token": "rdzen.rozmiar.obwodka-srednia"
              }
            },
            "pomoc": {
              "color": {
                "token": "rdzen.funkcjonalne.formularz-blad"
              }
            }
          }
        }
      },
      "states": {
        "najechanie": {
          "ramka": {
            "borderColor": {
              "token": "rdzen.semantic.obwodka-wyrazna"
            }
          }
        },
        "skupienie": {
          "ramka": {
            "borderColor": {
              "token": "rdzen.komponent.pole-obwodka-skupienie"
            },
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            }
          }
        },
        "otwarta": {
          "ramka": {
            "borderColor": {
              "token": "rdzen.komponent.pole-obwodka-skupienie"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            }
          },
          "strzalkaDol": {
            "width": {
              "token": "rdzen.rozmiar.odstep-000"
            },
            "opacity": {
              "token": "rdzen.krycie.przezroczyste"
            }
          },
          "strzalkaGora": {
            "width": {
              "token": "rdzen.rozmiar.ikona-sredni"
            },
            "opacity": {
              "token": "rdzen.krycie.pelne"
            }
          }
        },
        "blad": {
          "ramka": {
            "borderColor": {
              "token": "rdzen.semantic.obwodka-blad"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            }
          },
          "pomoc": {
            "color": {
              "token": "rdzen.funkcjonalne.formularz-blad"
            }
          }
        },
        "wylaczony": {
          "ramka": {
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            }
          },
          "etykieta": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          },
          "wartosc": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          },
          "strzalkaDol": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          },
          "pomoc": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          }
        }
      }
    }
  },
  "przelacznik": {
    "osie": {
      "stan": [
        "wlaczony",
        "wylaczony"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "stan",
          "type": "enum",
          "enum": [
            "wlaczony",
            "wylaczony"
          ],
          "required": true,
          "default": "wylaczony",
          "description": "Aktualne ustawienie. Zmiana obowiązuje od razu — nie ma przycisku zatwierdzenia ani cofnięcia."
        },
        {
          "name": "etykieta",
          "type": "string",
          "required": true,
          "default": "Powiadomienia e-mail",
          "description": "Nazwa ustawienia widoczna obok toru; próbka renderu bierze wartość domyślną."
        },
        {
          "name": "przyZmianie",
          "type": "function",
          "required": true,
          "description": "Wywoływana z nową wartością w momencie przełączenia. Komponent nie trzyma stanu sam — wartość wraca do niego propem stan."
        },
        {
          "name": "niedostepny",
          "type": "boolean",
          "required": false,
          "default": false,
          "description": "Blokuje zmianę, gdy o ustawieniu decyduje polityka konta albo nadrzędny przełącznik grupy."
        }
      ],
      "states": {
        "spoczynek": "Wartość czytelna z dwóch rzeczy naraz: położenia uchwytu (przy lewej albo przy prawej krawędzi toru) i wypełnienia toru, więc odczyt nie opiera się na samym kolorze.",
        "najechanie": "Kursor nad torem lub etykietą: obwódka uchwytu wzmacnia się z subtelnej do wyrazistej, a tor zostaje w swoim kolorze. Kolor toru niesie wartość, więc jego zmiana przy najechaniu udawałaby przełączenie.",
        "skupienie": "Skupienie z klawiatury: wokół toru pierścień w kolorze obwódki skupienia, o grubości obwódki grubej. Samo wejście skupieniem nie zmienia wartości.",
        "niedostepny": "Prop niedostepny ustawiony na true: tor gaśnie do koloru akcji wyłączonej, obwódka toru słabnie do subtelnej, uchwyt schodzi do krycia mocnego, etykieta do tekstu wyłączonego, a kliknięcie i spacja nie wywołują przyZmianie."
      },
      "behavior": {
        "przelaczanie": "Kliknięcie w tor albo w etykietę zmienia wartość natychmiast i zgłasza ją przez przyZmianie; przełącznik nie czeka na wysyłkę formularza.",
        "obszarKlikalny": "Tor 40 na 24 piksele plus cała etykieta stanowią jeden cel; rodzic formularza dopełnia wysokość wiersza do 44 pikseli.",
        "nieudanyZapis": "Gdy usługa odrzuci zmianę, rodzic ustawia z powrotem poprzednią wartość propu stan i uchwyt wraca — komunikat o błędzie należy do formularza, nie do przełącznika.",
        "ruchUchwytu": "Uchwyt przesuwa się o 16 pikseli między krańcami toru (40 pikseli szerokości minus dopełnienie 2 piksele z każdej strony minus 20 pikseli uchwytu); przy włączonym w systemie ograniczeniu ruchu przeskakuje bez animacji.",
        "niePrzycisk": "Przełącznika nie używa się do akcji nieodwracalnych (usunięcie, wysłanie) — do tego jest przycisk, bo brak potwierdzenia jest tu cechą, nie brakiem."
      },
      "a11y": {
        "rola": "switch",
        "klawiatura": "Spacja przełącza wartość. Enter jest celowo pomijany, żeby nie kolidował z domyślną wysyłką formularza; Tab wchodzi i wychodzi.",
        "czytnikEkranu": "Nazwa z propu etykieta powiązanej z torem, wartość przez aria-checked (true dla wlaczony, false dla wylaczony), blokada przez aria-disabled — element zostaje w kolejności odczytu.",
        "kontrast": "Uchwyt w kolorze tła powierzchni leży na torze w kolorze tła wyciszonego, a ta para bywa cicha — dlatego uchwyt ma własną obwódkę subtelną, a tor obwódkę wyrazną. Kształt kontrolki trzyma 3:1 wobec otoczenia także wtedy, gdy marka rozjaśni tło wyciszone."
      },
      "tokenConsumption": [
        "rdzen.semantic.odstep-zwykly",
        "rdzen.rozmiar.odstep-500",
        "rdzen.rozmiar.odstep-300",
        "rdzen.rozmiar.odstep-250",
        "rdzen.rozmiar.odstep-200",
        "rdzen.rozmiar.odstep-025",
        "rdzen.rozmiar.odstep-000",
        "rdzen.semantic.promien-pelny",
        "rdzen.semantic.tlo-wyciszone",
        "rdzen.semantic.tlo-powierzchnia",
        "rdzen.semantic.akcja-podstawowa",
        "rdzen.semantic.akcja-wylaczona",
        "rdzen.semantic.obwodka-wyrazna",
        "rdzen.semantic.obwodka-subtelna",
        "rdzen.semantic.obwodka-skupienie",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.rozmiar.obwodka-gruba",
        "rdzen.semantic.tekst-podstawowy",
        "rdzen.semantic.tekst-wylaczony",
        "rdzen.semantic.typografia-tresc",
        "rdzen.typografia.wysokosc-zwykla",
        "rdzen.typografia.rodzina-podstawowa",
        "rdzen.krycie.mocne"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "row",
          "children": [
            "tor",
            "etykieta"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-zwykly"
            }
          }
        },
        {
          "id": "tor",
          "element": "box",
          "children": [
            "przesuniecie",
            "uchwyt"
          ],
          "bind": {
            "width": {
              "token": "rdzen.rozmiar.odstep-500"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-300"
            },
            "radius": {
              "token": "rdzen.semantic.promien-pelny"
            },
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-wyrazna"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "paddingX": {
              "token": "rdzen.rozmiar.odstep-025"
            },
            "paddingY": {
              "token": "rdzen.rozmiar.odstep-025"
            }
          }
        },
        {
          "id": "przesuniecie",
          "element": "spacer",
          "bind": {
            "width": {
              "token": "rdzen.rozmiar.odstep-000"
            }
          }
        },
        {
          "id": "uchwyt",
          "element": "box",
          "bind": {
            "width": {
              "token": "rdzen.rozmiar.odstep-250"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-250"
            },
            "radius": {
              "token": "rdzen.semantic.promien-pelny"
            },
            "background": {
              "token": "rdzen.semantic.tlo-powierzchnia"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            }
          }
        },
        {
          "id": "etykieta",
          "element": "text",
          "textFrom": "props.etykieta.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwykla"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        }
      ],
      "variants": {
        "stan": {
          "wlaczony": {
            "tor": {
              "background": {
                "token": "rdzen.semantic.akcja-podstawowa"
              },
              "borderColor": {
                "token": "rdzen.semantic.akcja-podstawowa"
              }
            },
            "przesuniecie": {
              "width": {
                "token": "rdzen.rozmiar.odstep-200"
              }
            }
          },
          "wylaczony": {
            "tor": {
              "background": {
                "token": "rdzen.semantic.tlo-wyciszone"
              },
              "borderColor": {
                "token": "rdzen.semantic.obwodka-wyrazna"
              }
            },
            "przesuniecie": {
              "width": {
                "token": "rdzen.rozmiar.odstep-000"
              }
            }
          }
        }
      },
      "states": {
        "najechanie": {
          "uchwyt": {
            "borderColor": {
              "token": "rdzen.semantic.obwodka-wyrazna"
            }
          }
        },
        "skupienie": {
          "tor": {
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-gruba"
            }
          }
        },
        "niedostepny": {
          "tor": {
            "background": {
              "token": "rdzen.semantic.akcja-wylaczona"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            }
          },
          "uchwyt": {
            "opacity": {
              "token": "rdzen.krycie.mocne"
            }
          },
          "etykieta": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          }
        }
      }
    }
  },
  "suwak": {
    "osie": {
      "stan": [
        "zwykly",
        "wylaczony"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "stan",
          "type": "enum",
          "enum": [
            "zwykly",
            "wylaczony"
          ],
          "required": true,
          "default": "zwykly",
          "description": "Zwykły przyjmuje przeciąganie i klawiaturę; wyłączony nadal pokazuje wartość, ale jej nie zmienia."
        },
        {
          "name": "wartosc",
          "type": "number",
          "required": true,
          "default": 60,
          "description": "Bieżąca wartość w zakresie min–max, zawsze wielokrotność kroku liczona od min; próbka renderu wypisuje ją pod torem. Jednostkę (procent, kilometr) dopisuje formularz, nie suwak."
        },
        {
          "name": "min",
          "type": "number",
          "required": false,
          "default": 0,
          "description": "Dolny kraniec zakresu; wartość niższa jest przycinana do niego przy wejściu."
        },
        {
          "name": "max",
          "type": "number",
          "required": false,
          "default": 100,
          "description": "Górny kraniec zakresu; wyznacza też miejsce, w które trafia klawisz End."
        },
        {
          "name": "krok",
          "type": "number",
          "required": false,
          "default": 5,
          "description": "Skok jednego naciśnięcia strzałki i zaokrąglenie wyniku przeciągania."
        },
        {
          "name": "etykieta",
          "type": "string",
          "required": true,
          "default": "Promień wyszukiwania",
          "description": "Nazwa suwaka: trafia do etykiety zewnętrznej i do odczytu czytnika ekranu. Na próbce nie jest rysowana, bo należy do pola formularza."
        }
      ],
      "states": {
        "spoczynek": "Długość wypełnienia i położenie uchwytu odpowiadają wartości: przy domyślnych 60 na 100 wypełnienie zajmuje trzy piąte toru. Podpis liczbowy pod torem podaje wartość dokładnie.",
        "najechanie": "Kursor nad uchwytem lub torem: wypełnienie i uchwyt ciemnieją o krok skali akcji, grubość toru zostaje bez zmian, żeby nic nie drgnęło. W wariancie wylaczony najechanie nie zmienia niczego.",
        "skupienie": "Uchwyt otoczony pierścieniem w kolorze obwódki skupienia, o grubości obwódki grubej; od tego momentu strzałki zmieniają wartość o krok, a Home i End skaczą na krańce.",
        "przeciaganie": "Kursor trzyma uchwyt: wartość aktualizuje się na bieżąco, a podpis pod torem pogrubia się i ciemnieje do tekstu podstawowego, bo w trakcie ruchu jest jedynym dokładnym odczytem."
      },
      "behavior": {
        "zmianaWartosci": "Przeciąganie i strzałki zaokrąglają wynik do wielokrotności kroku liczonej od min; wynik poza zakresem jest przycinany do krańca, nie zawijany.",
        "klikniecieWTor": "Kliknięcie w tor przesuwa uchwyt do najbliższej wartości zgodnej z krokiem i od razu przejmuje przeciąganie, bez puszczania przycisku.",
        "publikacjaZmiany": "W trakcie przeciągania zmiana jest zgłaszana na bieżąco (do podglądu), a po puszczeniu uchwytu jeszcze raz, jako zatwierdzona — zapisywana jest ta druga.",
        "odczytWartosci": "Podpis używa kroju o stałej szerokości, więc liczba nie drga na boki przy przeciąganiu przez wartości o różnej szerokości cyfr.",
        "zakresPusty": "Gdy min równa się max, uchwyt stoi na krańcu, a suwak nie przyjmuje interakcji i dostaje aria-disabled, mimo że prop stan ma wartość zwykly."
      },
      "a11y": {
        "rola": "slider",
        "klawiatura": "Strzałki lewo i prawo oraz dół i góra zmieniają wartość o jeden krok, PageUp i PageDown o dziesięć kroków, Home i End ustawiają min i max.",
        "czytnikEkranu": "Nazwa z propu etykieta przez aria-label; aria-valuenow, aria-valuemin i aria-valuemax są odczytywane po każdej zmianie, także w trakcie przeciągania.",
        "celDotykowy": "Sam uchwyt ma 16 pikseli, ale obszar chwytania jest powiększany do 44 na 44 piksele wokół jego środka — palec nie musi trafiać w rysunek.",
        "niezaleznoscOdKoloru": "Wartość da się odczytać z podpisu liczbowego, więc różnica między wypełnieniem a resztą toru nie jest jedynym nośnikiem informacji."
      },
      "tokenConsumption": [
        "rdzen.semantic.odstep-ciasny",
        "rdzen.rozmiar.odstep-000",
        "rdzen.rozmiar.odstep-050",
        "rdzen.rozmiar.odstep-200",
        "rdzen.rozmiar.odstep-400",
        "rdzen.rozmiar.odstep-600",
        "rdzen.semantic.promien-pelny",
        "rdzen.semantic.akcja-podstawowa",
        "rdzen.semantic.akcja-podstawowa-najechanie",
        "rdzen.semantic.akcja-podstawowa-aktywna",
        "rdzen.semantic.akcja-wylaczona",
        "rdzen.semantic.tlo-wyciszone",
        "rdzen.semantic.tlo-powierzchnia",
        "rdzen.rozmiar.obwodka-srednia",
        "rdzen.rozmiar.obwodka-gruba",
        "rdzen.semantic.obwodka-skupienie",
        "rdzen.semantic.tekst-drugorzedny",
        "rdzen.semantic.tekst-podstawowy",
        "rdzen.semantic.tekst-wylaczony",
        "rdzen.semantic.typografia-podpis",
        "rdzen.typografia.rodzina-o-stalej-szerokosci",
        "rdzen.typografia.wysokosc-ciasna",
        "rdzen.typografia.grubosc-pogrubiona"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "stack",
          "children": [
            "tor",
            "wartosc"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            }
          }
        },
        {
          "id": "tor",
          "element": "row",
          "children": [
            "wypelnienie",
            "uchwyt",
            "reszta"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.rozmiar.odstep-000"
            }
          }
        },
        {
          "id": "wypelnienie",
          "element": "spacer",
          "bind": {
            "width": {
              "token": "rdzen.rozmiar.odstep-600"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-050"
            },
            "background": {
              "token": "rdzen.semantic.akcja-podstawowa"
            },
            "radius": {
              "token": "rdzen.semantic.promien-pelny"
            }
          }
        },
        {
          "id": "uchwyt",
          "element": "box",
          "bind": {
            "width": {
              "token": "rdzen.rozmiar.odstep-200"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-200"
            },
            "radius": {
              "token": "rdzen.semantic.promien-pelny"
            },
            "background": {
              "token": "rdzen.semantic.akcja-podstawowa"
            },
            "borderColor": {
              "token": "rdzen.semantic.tlo-powierzchnia"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            }
          }
        },
        {
          "id": "reszta",
          "element": "spacer",
          "bind": {
            "width": {
              "token": "rdzen.rozmiar.odstep-400"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-050"
            },
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            },
            "radius": {
              "token": "rdzen.semantic.promien-pelny"
            }
          }
        },
        {
          "id": "wartosc",
          "element": "text",
          "textFrom": "props.wartosc.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-o-stalej-szerokosci"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            }
          }
        }
      ],
      "variants": {
        "stan": {
          "zwykly": {
            "wypelnienie": {
              "background": {
                "token": "rdzen.semantic.akcja-podstawowa"
              }
            },
            "uchwyt": {
              "background": {
                "token": "rdzen.semantic.akcja-podstawowa"
              }
            },
            "wartosc": {
              "color": {
                "token": "rdzen.semantic.tekst-drugorzedny"
              }
            }
          },
          "wylaczony": {
            "wypelnienie": {
              "background": {
                "token": "rdzen.semantic.akcja-wylaczona"
              }
            },
            "uchwyt": {
              "background": {
                "token": "rdzen.semantic.akcja-wylaczona"
              }
            },
            "wartosc": {
              "color": {
                "token": "rdzen.semantic.tekst-wylaczony"
              }
            }
          }
        }
      },
      "states": {
        "najechanie": {
          "wypelnienie": {
            "background": {
              "token": "rdzen.semantic.akcja-podstawowa-najechanie"
            }
          },
          "uchwyt": {
            "background": {
              "token": "rdzen.semantic.akcja-podstawowa-najechanie"
            }
          }
        },
        "skupienie": {
          "uchwyt": {
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-gruba"
            }
          }
        },
        "przeciaganie": {
          "wypelnienie": {
            "background": {
              "token": "rdzen.semantic.akcja-podstawowa-aktywna"
            }
          },
          "uchwyt": {
            "background": {
              "token": "rdzen.semantic.akcja-podstawowa-aktywna"
            }
          },
          "wartosc": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-pogrubiona"
            }
          }
        }
      }
    }
  },
  "karta": {
    "osie": {
      "uklad": [
        "pionowy",
        "poziomy"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "uklad",
          "type": "enum",
          "enum": [
            "pionowy",
            "poziomy"
          ],
          "required": true,
          "default": "pionowy",
          "description": "Kierunek osi głównej: pionowy stawia miniaturę nad treścią, poziomy obok treści."
        },
        {
          "name": "naglowek",
          "type": "string",
          "required": true,
          "default": "Raport miesięczny",
          "description": "Tytuł tematu, który karta grupuje; jedyne miejsce, po którym karta jest identyfikowana, i jedyny odsyłacz w jej wnętrzu."
        },
        {
          "name": "opis",
          "type": "string",
          "required": false,
          "default": "Zużycie i koszty za bieżący okres rozliczeniowy.",
          "description": "Zdanie doprecyzowujące nagłówek; pominięcie skraca kartę, nie zostawiając pustego wiersza po opisie."
        },
        {
          "name": "interaktywna",
          "type": "boolean",
          "required": false,
          "default": false,
          "description": "Gdy prawda, odsyłacz nagłówka rozciąga pole kliknięcia na całą kartę, a karta zyskuje stany najechania i skupienia."
        },
        {
          "name": "zMiniatura",
          "type": "boolean",
          "required": false,
          "default": true,
          "description": "Obecność pola miniatury; przy fałszu nagłówek przesuwa się do górnej krawędzi dopełnienia, a odstęp po miniaturze znika."
        }
      ],
      "states": {
        "spoczynek": "Karta leży na powierzchni z cienką obwódką i promieniem powierzchni; przy interaktywna=false to jedyny stan, jaki komponent osiąga.",
        "najechanie": "Wyłącznie przy interaktywna=true: tło przechodzi z powierzchni karty na wyniesione, obwódka z domyślnej na wyraźną, a treść nie zmienia położenia ani rozmiaru, żeby rząd kart nie drgał.",
        "skupienie": "Wyłącznie przy interaktywna=true: obrys skupienia obejmuje całą powierzchnię razem z miniaturą, mimo że skupienie ma odsyłacz w nagłówku; sam nagłówek nie dostaje drugiego obrysu."
      },
      "behavior": {
        "calaPowierzchniaJakoCel": "Przy interaktywna=true odsyłacz nagłówka rozciąga pole kliknięcia na całą kartę warstwą nakładaną, więc kliknięcie w miniaturę albo opis prowadzi do tego samego celu; zagnieżdżone przyciski leżą nad tą warstwą i zachowują własne cele.",
        "lamanieTekstu": "Nagłówek łamie się najwyżej do dwóch wierszy, opis do trzech; nadmiar ucina wielokropek, dzięki czemu karty w jednym rzędzie siatki mają równą wysokość.",
        "ukladPoziomy": "Przy uklad=poziomy miniatura staje się kwadratem i stoi przed treścią; kolejność w kodzie się nie zmienia, więc czytnik ekranu dostaje tę samą sekwencję w obu układach.",
        "brakZagniezdzania": "Karta nie zagnieżdża drugiej karty; powierzchnia wstawiona do jej wnętrza traci obwódkę i własne tło, żeby nie powstała podwójna ramka."
      },
      "a11y": {
        "rola": "Element article; jedyny odsyłacz karty siedzi w nagłówku i to on niesie cel — karta nigdy nie jest odsyłaczem opakowującym całą treść, bo odsyłacz nie może zawierać zagnieżdżonych przycisków.",
        "klawiatura": "Karta nieinteraktywna nie zbiera skupienia. Interaktywna daje jeden przystanek Tab na odsyłaczu nagłówka, Enter otwiera cel, a zagnieżdżone akcje są kolejnymi przystankami po nim.",
        "czytnikEkranu": "aria-labelledby wskazuje nagłówek, aria-describedby opis; miniatura jest ozdobna i ma pusty tekst alternatywny, więc czytnik nie zapowiada jej przed nagłówkiem."
      },
      "tokenConsumption": [
        "rdzen.komponent.karta-tlo",
        "rdzen.komponent.karta-obwodka",
        "rdzen.komponent.karta-naglowek",
        "rdzen.komponent.karta-opis",
        "rdzen.semantic.promien-powierzchnia",
        "rdzen.semantic.promien-interakcja",
        "rdzen.semantic.odstep-zwykly",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.semantic.odstep-przylegly",
        "rdzen.semantic.tlo-wyciszone",
        "rdzen.semantic.tlo-wyniesione",
        "rdzen.semantic.tekst-drugorzedny",
        "rdzen.semantic.obwodka-wyrazna",
        "rdzen.semantic.obwodka-skupienie",
        "rdzen.semantic.typografia-naglowek-4",
        "rdzen.semantic.typografia-podpis",
        "rdzen.typografia.grubosc-pogrubiona",
        "rdzen.typografia.wysokosc-zwarta",
        "rdzen.typografia.wysokosc-zwykla",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.rozmiar.obwodka-srednia",
        "rdzen.rozmiar.odstep-400",
        "rdzen.rozmiar.odstep-500",
        "rdzen.rozmiar.odstep-600",
        "rdzen.rozmiar.ikona-sredni"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "stack",
          "children": [
            "miniatura",
            "tresc"
          ],
          "bind": {
            "background": {
              "token": "rdzen.komponent.karta-tlo"
            },
            "borderColor": {
              "token": "rdzen.komponent.karta-obwodka"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "radius": {
              "token": "rdzen.semantic.promien-powierzchnia"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "width": {
              "token": "rdzen.rozmiar.odstep-600"
            }
          }
        },
        {
          "id": "miniatura",
          "element": "box",
          "children": [
            "znakMiniatury"
          ],
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            },
            "width": {
              "token": "rdzen.rozmiar.odstep-500"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-400"
            }
          }
        },
        {
          "id": "znakMiniatury",
          "element": "icon",
          "iconName": "informacja",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-sredni"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-sredni"
            }
          }
        },
        {
          "id": "tresc",
          "element": "stack",
          "children": [
            "naglowek",
            "opis"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-przylegly"
            }
          }
        },
        {
          "id": "naglowek",
          "element": "text",
          "textFrom": "props.naglowek.default",
          "bind": {
            "color": {
              "token": "rdzen.komponent.karta-naglowek"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-naglowek-4"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-pogrubiona"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwarta"
            }
          }
        },
        {
          "id": "opis",
          "element": "text",
          "textFrom": "props.opis.default",
          "bind": {
            "color": {
              "token": "rdzen.komponent.karta-opis"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwykla"
            }
          }
        }
      ],
      "variants": {
        "uklad": {
          "poziomy": {
            "root": {
              "gap": {
                "token": "rdzen.semantic.odstep-zwykly"
              },
              "paddingY": {
                "token": "rdzen.semantic.odstep-ciasny"
              }
            },
            "miniatura": {
              "width": {
                "token": "rdzen.rozmiar.odstep-400"
              }
            }
          }
        }
      },
      "states": {
        "najechanie": {
          "root": {
            "background": {
              "token": "rdzen.semantic.tlo-wyniesione"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-wyrazna"
            }
          }
        },
        "skupienie": {
          "root": {
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            }
          }
        }
      }
    }
  },
  "karta-produktu": {
    "osie": {
      "uklad": [
        "siatka",
        "lista"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "uklad",
          "type": "enum",
          "enum": [
            "siatka",
            "lista"
          ],
          "required": true,
          "default": "siatka",
          "description": "Siatka układa obraz nad opisem w kafelku katalogu, lista zmniejsza obraz do kwadratu obok tekstu."
        },
        {
          "name": "nazwa",
          "type": "string",
          "required": true,
          "default": "Filtr powietrza 120 mm",
          "description": "Nazwa handlowa pozycji; jest odsyłaczem do strony szczegółów."
        },
        {
          "name": "cena",
          "type": "string",
          "required": true,
          "default": "149,00 zł",
          "description": "Cena obowiązująca, z walutą i separatorem dziesiętnym zgodnym z ustawieniami regionalnymi."
        },
        {
          "name": "cenaPoprzednia",
          "type": "string",
          "required": false,
          "default": "199,00 zł",
          "description": "Cena sprzed obniżki, rysowana przekreśleniem; pokazywana tylko wtedy, gdy jest wyższa od ceny obowiązującej."
        },
        {
          "name": "etykietaAkcji",
          "type": "string",
          "required": true,
          "default": "Do koszyka",
          "description": "Tekst przycisku dodania do koszyka; próbka renderu bierze wartość domyślną."
        },
        {
          "name": "dostepny",
          "type": "boolean",
          "required": false,
          "default": true,
          "description": "Fałsz przełącza kartę w stan niedostępny: przygasza obraz i blokuje przycisk, nie ukrywając ceny ani odsyłacza do strony produktu."
        }
      ],
      "states": {
        "spoczynek": "Obraz, nazwa, para cen i przycisk stoją na powierzchni karty z cienką obwódką; przycisk jest wypełniony tłem akcji podstawowej i widoczny od razu, bez najeżdżania.",
        "najechanie": "Obwódka karty przechodzi z domyślnej na wyraźną, a tło przycisku o krok ciemnieje; wymiary kafelka nie zmieniają się, więc siatka nie przelicza układu.",
        "skupienie": "Obrys skupienia otacza całą kartę, gdy skupienie ma odsyłacz nazwy, i sam przycisk, gdy skupienie ma przycisk — dwa cele mają dwa osobne obrysy.",
        "niedostepny": "Obraz spada do połowy krycia, cena przechodzi na kolor tekstu wyłączonego, tło przycisku na kolor akcji wyłączonej; nazwa nadal prowadzi do strony produktu."
      },
      "behavior": {
        "dwaCeleKlikniecia": "Obraz i nazwa otwierają stronę produktu, przycisk dodaje do koszyka; kliknięcie przycisku nie przechodzi na odsyłacz karty.",
        "stalaWidocznoscAkcji": "Przycisk jest w pełni widoczny w każdym stanie karty, także bez najechania — odsłanianie akcji dopiero po najechaniu odcięłoby obsługę dotykiem i klawiaturą.",
        "paraCen": "Cena poprzednia stoi po prawej od obowiązującej i znika, gdy obniżki nie ma; cena obowiązująca nie zmienia rozmiaru między układami, więc wzrok wraca zawsze w to samo miejsce.",
        "dlugoscNazwy": "Nazwa łamie się do dwóch wierszy i jest ucinana wielokropkiem, żeby wiersz cen i przycisk stały na tej samej wysokości we wszystkich kartach rzędu."
      },
      "a11y": {
        "rola": "Element article w elemencie li; lista kart jest elementem ul w obu układach, żeby czytnik zapowiedział liczbę pozycji także w siatce.",
        "klawiatura": "Dwa przystanki Tab w kolejności: odsyłacz nazwy, przycisk akcji. Obraz jest wyłączony z kolejności, bo prowadzi tam gdzie nazwa.",
        "czytnikEkranu": "Cena poprzednia jest poprzedzona tekstem dla czytnika „cena przed obniżką”, żeby przekreślenie nie było jedynym nośnikiem znaczenia; przy dostepny=false przycisk dostaje aria-disabled, a wynik dodania do koszyka trafia do obszaru aria-live poza kartą."
      },
      "tokenConsumption": [
        "rdzen.komponent.karta-tlo",
        "rdzen.komponent.karta-obwodka",
        "rdzen.komponent.przycisk-tlo",
        "rdzen.komponent.przycisk-tlo-najechanie",
        "rdzen.komponent.przycisk-tresc-odwrocona",
        "rdzen.semantic.tlo-wyciszone",
        "rdzen.semantic.tekst-podstawowy",
        "rdzen.semantic.tekst-drugorzedny",
        "rdzen.semantic.tekst-wylaczony",
        "rdzen.semantic.akcja-wylaczona",
        "rdzen.semantic.obwodka-wyrazna",
        "rdzen.semantic.obwodka-skupienie",
        "rdzen.semantic.promien-powierzchnia",
        "rdzen.semantic.promien-interakcja",
        "rdzen.semantic.odstep-zwykly",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.semantic.odstep-przylegly",
        "rdzen.semantic.typografia-tresc",
        "rdzen.semantic.typografia-tresc-duza",
        "rdzen.semantic.typografia-podpis",
        "rdzen.semantic.typografia-przycisk",
        "rdzen.typografia.grubosc-srednia",
        "rdzen.typografia.grubosc-pogrubiona",
        "rdzen.typografia.wysokosc-zwarta",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.rozmiar.obwodka-srednia",
        "rdzen.rozmiar.odstep-400",
        "rdzen.rozmiar.odstep-500",
        "rdzen.rozmiar.odstep-600",
        "rdzen.rozmiar.ikona-duzy",
        "rdzen.krycie.polowa"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "stack",
          "children": [
            "obraz",
            "nazwa",
            "ceny",
            "przycisk"
          ],
          "bind": {
            "background": {
              "token": "rdzen.komponent.karta-tlo"
            },
            "borderColor": {
              "token": "rdzen.komponent.karta-obwodka"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "radius": {
              "token": "rdzen.semantic.promien-powierzchnia"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "width": {
              "token": "rdzen.rozmiar.odstep-600"
            }
          }
        },
        {
          "id": "obraz",
          "element": "box",
          "children": [
            "znakObrazu"
          ],
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            },
            "width": {
              "token": "rdzen.rozmiar.odstep-500"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-500"
            }
          }
        },
        {
          "id": "znakObrazu",
          "element": "icon",
          "iconName": "lupa",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-duzy"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-duzy"
            }
          }
        },
        {
          "id": "nazwa",
          "element": "text",
          "textFrom": "props.nazwa.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwarta"
            }
          }
        },
        {
          "id": "ceny",
          "element": "row",
          "children": [
            "cena",
            "cenaPoprzednia"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-przylegly"
            }
          }
        },
        {
          "id": "cena",
          "element": "text",
          "textFrom": "props.cena.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc-duza"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-pogrubiona"
            }
          }
        },
        {
          "id": "cenaPoprzednia",
          "element": "text",
          "textFrom": "props.cenaPoprzednia.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            }
          }
        },
        {
          "id": "przycisk",
          "element": "box",
          "children": [
            "etykietaPrzycisku"
          ],
          "bind": {
            "background": {
              "token": "rdzen.komponent.przycisk-tlo"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-przylegly"
            }
          }
        },
        {
          "id": "etykietaPrzycisku",
          "element": "text",
          "textFrom": "props.etykietaAkcji.default",
          "bind": {
            "color": {
              "token": "rdzen.komponent.przycisk-tresc-odwrocona"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-przycisk"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            }
          }
        }
      ],
      "variants": {
        "uklad": {
          "lista": {
            "root": {
              "gap": {
                "token": "rdzen.semantic.odstep-zwykly"
              },
              "paddingX": {
                "token": "rdzen.semantic.odstep-zwykly"
              }
            },
            "obraz": {
              "width": {
                "token": "rdzen.rozmiar.odstep-400"
              },
              "height": {
                "token": "rdzen.rozmiar.odstep-400"
              }
            },
            "nazwa": {
              "fontSize": {
                "token": "rdzen.semantic.typografia-podpis"
              }
            }
          }
        }
      },
      "states": {
        "najechanie": {
          "root": {
            "borderColor": {
              "token": "rdzen.semantic.obwodka-wyrazna"
            }
          },
          "przycisk": {
            "background": {
              "token": "rdzen.komponent.przycisk-tlo-najechanie"
            }
          }
        },
        "skupienie": {
          "root": {
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            }
          }
        },
        "niedostepny": {
          "obraz": {
            "opacity": {
              "token": "rdzen.krycie.polowa"
            }
          },
          "cena": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          },
          "przycisk": {
            "background": {
              "token": "rdzen.semantic.akcja-wylaczona"
            }
          }
        }
      }
    }
  },
  "tabela": {
    "osie": {
      "gestosc": [
        "zwykla",
        "zwarta"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "gestosc",
          "type": "enum",
          "enum": [
            "zwykla",
            "zwarta"
          ],
          "required": true,
          "default": "zwykla",
          "description": "Wysokość wiersza i dopełnienie komórek; zwarta mieści o trzy wiersze więcej na tej samej wysokości ekranu."
        },
        {
          "name": "kolumny",
          "type": "array",
          "required": true,
          "description": "Definicje kolumn: nagłówek, wyrównanie treści i informacja, czy kolumna daje się sortować."
        },
        {
          "name": "dane",
          "type": "array",
          "required": true,
          "description": "Wiersze w kolejności do wyświetlenia; tabela sama danych nie przestawia, zgłasza tylko żądany klucz porządku."
        },
        {
          "name": "podpis",
          "type": "string",
          "required": false,
          "default": "Wykaz pozycji",
          "description": "Podpis zbioru wypisywany w caption i czytany przed treścią tabeli; nie jest rysowany w próbce renderu."
        },
        {
          "name": "naglowekKlucza",
          "type": "string",
          "required": false,
          "default": "Pozycja",
          "description": "Nagłówek pierwszej kolumny; próbka renderu wypisuje wartość domyślną."
        },
        {
          "name": "naglowekWartosci",
          "type": "string",
          "required": false,
          "default": "Stan",
          "description": "Nagłówek drugiej kolumny; próbka renderu wypisuje wartość domyślną."
        },
        {
          "name": "kierunekSortowania",
          "type": "enum",
          "enum": [
            "rosnaco",
            "malejaco"
          ],
          "required": false,
          "default": "rosnaco",
          "description": "Kierunek porządku dla kolumny będącej kluczem; ustawia zwrot strzałki przy jej nagłówku i wartość aria-sort."
        },
        {
          "name": "wierszNaprzemienny",
          "type": "boolean",
          "required": false,
          "default": true,
          "description": "Parzyste wiersze biorą drugi odcień tła; przy wyłączeniu wszystkie wiersze mają tło jednakowe."
        },
        {
          "name": "komunikatPustej",
          "type": "string",
          "required": false,
          "default": "Brak pozycji do pokazania",
          "description": "Treść zastępująca korpus, gdy lista danych jest pusta; nagłówek zostaje na miejscu."
        },
        {
          "name": "przykladKlucza",
          "type": "string",
          "required": false,
          "default": "Pozycja 24",
          "description": "Treść pierwszej komórki w próbce renderu; w użyciu produkcyjnym wartość pochodzi z `dane`."
        },
        {
          "name": "przykladWartosci",
          "type": "string",
          "required": false,
          "default": "Aktywna",
          "description": "Treść drugiej komórki pierwszego wiersza próbki; w użyciu produkcyjnym wartość pochodzi z `dane`."
        },
        {
          "name": "przykladKluczaDrugiego",
          "type": "string",
          "required": false,
          "default": "Pozycja 25",
          "description": "Treść pierwszej komórki drugiego wiersza próbki, pokazująca tło naprzemienne."
        },
        {
          "name": "przykladWartosciDrugiej",
          "type": "string",
          "required": false,
          "default": "Wstrzymana",
          "description": "Treść drugiej komórki drugiego wiersza próbki; w użyciu produkcyjnym wartość pochodzi z `dane`."
        }
      ],
      "states": {
        "spoczynek": "Komplet wierszy wczytany, nagłówek odcina się od korpusu własnym tłem, żadna kolumna nie jest wskazana kursorem.",
        "sortowanie": "Kolumna będąca kluczem porządku wyróżniona: jej nagłówek dostaje mocniejszą grubość, kolor akcji podstawowej i pełne krycie strzałki zgodnej z kierunkiem.",
        "ladowanie": "Dane są pobierane: korpus schodzi do połowy krycia, nagłówek zostaje w pełnej czytelności, a wysokość tabeli się nie zmienia, więc treść pod nią nie skacze.",
        "pusta": "Zapytanie nie zwróciło wierszy: korpus ustępuje miejsca treści z `komunikatPustej` na wyciszonym tle i w kolorze tekstu drugorzędnego, bez przygaszania krycia, żeby komunikat dało się przeczytać; wyliczone szerokości kolumn zostają zapamiętane."
      },
      "behavior": {
        "sortowanie": "Kliknięcie w nagłówek sortowalnej kolumny czyni ją kluczem porządku i ustawia kierunek rosnący, a każde kolejne kliknięcie w ten sam nagłówek odwraca kierunek na przeciwny; klucz może być tylko jeden, więc poprzednia kolumna traci strzałkę i wyróżnienie.",
        "przewijaniePoziome": "Gdy suma szerokości kolumn przekracza szerokość kontenera, korpus przewija się w poziomie razem z nagłówkiem, a pierwsza kolumna zostaje przyklejona do lewej krawędzi.",
        "naprzemiennoscWierszy": "Parzystość liczona na wierszach otrzymanych w `dane`, z numeracją od jednego, więc po podmianie zbioru pasy tła zaczynają się zawsze od tego samego odcienia.",
        "brakDanych": "Pusta lista `dane` zastępuje korpus jednym wierszem z treścią `komunikatPustej`; nagłówek i wyliczone szerokości kolumn zostają nietknięte."
      },
      "a11y": {
        "rola": "table z rowgroup dla nagłówka i korpusu, komórki nagłówkowe jako columnheader, treść `podpis` w caption.",
        "klawiatura": "Tab zatrzymuje się kolejno na nagłówkach sortowalnych kolumn; Enter albo spacja przestawia porządek kolumny wskazanej skupieniem, nagłówki bez sortowania są pomijane.",
        "czytnikEkranu": "Nagłówek kolumny porządkującej niesie aria-sort o wartości ascending albo descending; po każdej podmianie zbioru `dane` liczba wierszy jest ogłaszana w obszarze aria-live typu polite."
      },
      "tokenConsumption": [
        "rdzen.semantic.tlo-powierzchnia",
        "rdzen.funkcjonalne.tabela-obwodka",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.semantic.promien-powierzchnia",
        "rdzen.rozmiar.odstep-000",
        "rdzen.typografia.rodzina-podstawowa",
        "rdzen.funkcjonalne.tabela-naglowek-tlo",
        "rdzen.semantic.odstep-zwykly",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.rozmiar.odstep-050",
        "rdzen.rozmiar.odstep-400",
        "rdzen.rozmiar.odstep-300",
        "rdzen.semantic.tekst-podstawowy",
        "rdzen.semantic.tekst-drugorzedny",
        "rdzen.semantic.typografia-podpis",
        "rdzen.typografia.grubosc-pogrubiona",
        "rdzen.typografia.grubosc-srednia",
        "rdzen.typografia.grubosc-mocna",
        "rdzen.typografia.wysokosc-ciasna",
        "rdzen.rozmiar.ikona-maly",
        "rdzen.krycie.mocne",
        "rdzen.krycie.pelne",
        "rdzen.krycie.polowa",
        "rdzen.funkcjonalne.tabela-wiersz-tlo",
        "rdzen.funkcjonalne.tabela-wiersz-naprzemienny",
        "rdzen.semantic.akcja-podstawowa",
        "rdzen.semantic.tlo-wyciszone"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "stack",
          "children": [
            "naglowek",
            "wiersz-pierwszy",
            "wiersz-drugi"
          ],
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-powierzchnia"
            },
            "borderColor": {
              "token": "rdzen.funkcjonalne.tabela-obwodka"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "radius": {
              "token": "rdzen.semantic.promien-powierzchnia"
            },
            "gap": {
              "token": "rdzen.rozmiar.odstep-000"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        },
        {
          "id": "naglowek",
          "element": "row",
          "children": [
            "naglowek-klucz",
            "strzalka-porzadku",
            "naglowek-wartosc"
          ],
          "bind": {
            "background": {
              "token": "rdzen.funkcjonalne.tabela-naglowek-tlo"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "gap": {
              "token": "rdzen.rozmiar.odstep-050"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-400"
            },
            "borderColor": {
              "token": "rdzen.funkcjonalne.tabela-obwodka"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            }
          }
        },
        {
          "id": "naglowek-klucz",
          "element": "text",
          "textFrom": "props.naglowekKlucza.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-pogrubiona"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            }
          }
        },
        {
          "id": "strzalka-porzadku",
          "element": "icon",
          "iconName": "strzalka-gora",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-maly"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-maly"
            },
            "opacity": {
              "token": "rdzen.krycie.mocne"
            }
          }
        },
        {
          "id": "naglowek-wartosc",
          "element": "text",
          "textFrom": "props.naglowekWartosci.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            }
          }
        },
        {
          "id": "wiersz-pierwszy",
          "element": "row",
          "children": [
            "komorka-klucz-1",
            "komorka-wartosc-1"
          ],
          "bind": {
            "background": {
              "token": "rdzen.funkcjonalne.tabela-wiersz-tlo"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-400"
            },
            "borderColor": {
              "token": "rdzen.funkcjonalne.tabela-obwodka"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            }
          }
        },
        {
          "id": "komorka-klucz-1",
          "element": "text",
          "textFrom": "props.przykladKlucza.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            }
          }
        },
        {
          "id": "komorka-wartosc-1",
          "element": "text",
          "textFrom": "props.przykladWartosci.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            }
          }
        },
        {
          "id": "wiersz-drugi",
          "element": "row",
          "children": [
            "komorka-klucz-2",
            "komorka-wartosc-2"
          ],
          "bind": {
            "background": {
              "token": "rdzen.funkcjonalne.tabela-wiersz-naprzemienny"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-400"
            },
            "borderColor": {
              "token": "rdzen.funkcjonalne.tabela-obwodka"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            }
          }
        },
        {
          "id": "komorka-klucz-2",
          "element": "text",
          "textFrom": "props.przykladKluczaDrugiego.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            }
          }
        },
        {
          "id": "komorka-wartosc-2",
          "element": "text",
          "textFrom": "props.przykladWartosciDrugiej.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            }
          }
        }
      ],
      "variants": {
        "gestosc": {
          "zwarta": {
            "naglowek": {
              "paddingY": {
                "token": "rdzen.rozmiar.odstep-050"
              },
              "height": {
                "token": "rdzen.rozmiar.odstep-300"
              }
            },
            "wiersz-pierwszy": {
              "paddingY": {
                "token": "rdzen.rozmiar.odstep-050"
              },
              "height": {
                "token": "rdzen.rozmiar.odstep-300"
              }
            },
            "wiersz-drugi": {
              "paddingY": {
                "token": "rdzen.rozmiar.odstep-050"
              },
              "height": {
                "token": "rdzen.rozmiar.odstep-300"
              }
            }
          }
        }
      },
      "states": {
        "sortowanie": {
          "naglowek-klucz": {
            "color": {
              "token": "rdzen.semantic.akcja-podstawowa"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-mocna"
            }
          },
          "strzalka-porzadku": {
            "color": {
              "token": "rdzen.semantic.akcja-podstawowa"
            },
            "opacity": {
              "token": "rdzen.krycie.pelne"
            }
          }
        },
        "ladowanie": {
          "wiersz-pierwszy": {
            "opacity": {
              "token": "rdzen.krycie.polowa"
            }
          },
          "wiersz-drugi": {
            "opacity": {
              "token": "rdzen.krycie.polowa"
            }
          }
        },
        "pusta": {
          "wiersz-pierwszy": {
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            }
          },
          "wiersz-drugi": {
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            }
          },
          "komorka-klucz-1": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            }
          },
          "komorka-klucz-2": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            }
          }
        }
      }
    }
  },
  "wiersz-tabeli": {
    "osie": {
      "tlo": [
        "zwykle",
        "naprzemienne"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "tlo",
          "type": "enum",
          "enum": [
            "zwykle",
            "naprzemienne"
          ],
          "required": true,
          "default": "zwykle",
          "description": "Który z dwóch odcieni tła bierze wiersz; tabela nadaje wartość z parzystości numeru, wiersz sam jej nie liczy."
        },
        {
          "name": "numer",
          "type": "string",
          "required": false,
          "default": "24",
          "description": "Numer porządkowy w pierwszej komórce, pisany krojem o stałej szerokości, żeby cyfry stały w kolumnie."
        },
        {
          "name": "nazwa",
          "type": "string",
          "required": true,
          "default": "Pozycja 24",
          "description": "Treść komórki opisowej, pełniącej rolę nagłówka wiersza; próbka renderu wypisuje wartość domyślną."
        },
        {
          "name": "stan",
          "type": "string",
          "required": false,
          "default": "Aktywna",
          "description": "Treść komórki stanu; próbka renderu wypisuje wartość domyślną."
        },
        {
          "name": "klikalny",
          "type": "boolean",
          "required": false,
          "default": true,
          "description": "Włącza wybór całego wiersza: kursor wskazujący, reakcję na najechanie, przyjmowanie skupienia klawiaturą i strzałkę wejścia przy prawej krawędzi. Wyłącz dla wierszy czysto prezentacyjnych — znika wtedy także strzałka."
        },
        {
          "name": "zaznaczony",
          "type": "boolean",
          "required": false,
          "default": false,
          "description": "Wiersz należy do bieżącego zaznaczenia; tło przechodzi na subtelnie akcentowane, obwódka na kolor akcji podstawowej."
        }
      ],
      "states": {
        "spoczynek": "Wiersz w odcieniu wynikającym z osi `tlo`, bez wyróżnienia; cienka obwódka odcina go od wiersza następnego.",
        "najechanie": "Kursor nad wierszem klikalnym: tło przechodzi na wyciszone, kolory tekstu zostają bez zmian, więc kontrast komórek się nie psuje.",
        "zaznaczony": "Wiersz wszedł do bieżącego zaznaczenia: tło subtelnie akcentowane, obwódka w kolorze akcji podstawowej, stan trwa po zabraniu kursora.",
        "skupienie": "Wiersz klikalny wskazany klawiaturą: obwódka skupienia rysowana na zewnątrz krawędzi, więc komórki nie przesuwają się o grubość ramki."
      },
      "behavior": {
        "wybor": "Kliknięcie w dowolne miejsce wiersza zgłasza wybór, gdy `klikalny` jest włączone; kliknięcie w odnośnik lub przycisk wewnątrz komórki zatrzymuje się na tym elemencie i wyboru nie zgłasza.",
        "reakcjaNaKursor": "Podświetlenie tła i strzałka wejścia należą wyłącznie do wierszy klikalnych; wiersz czysto prezentacyjny nie zmienia się pod kursorem, żeby nie obiecywać akcji, której nie ma.",
        "przycinanieTresci": "Komórka o zbyt długiej treści urywa się wielokropkiem w jednym wierszu — wysokość jest stała i nie rośnie od treści, więc pasy naprzemienne trzymają rytm.",
        "szerokosciKomorek": "Wiersz dziedziczy szerokości z definicji kolumn tabeli i nie negocjuje własnego układu; użyty poza tabelą rozjeżdża się z sąsiadami."
      },
      "a11y": {
        "rola": "row wewnątrz rowgroup; komórki jako cell, komórka z nazwą jako rowheader.",
        "klawiatura": "Strzałka w dół i w górę przenosi skupienie na sąsiedni wiersz, spacja przełącza zaznaczenie wiersza klikalnego, Enter otwiera pozycję.",
        "czytnikEkranu": "Zaznaczenie niesione przez aria-selected; nazwa czytana jako nagłówek wiersza, dzięki czemu komórka stanu ma kontekst, do czego się odnosi, a strzałka wejścia jest ukryta przez aria-hidden."
      },
      "tokenConsumption": [
        "rdzen.funkcjonalne.tabela-wiersz-tlo",
        "rdzen.funkcjonalne.tabela-wiersz-naprzemienny",
        "rdzen.funkcjonalne.tabela-obwodka",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.rozmiar.odstep-050",
        "rdzen.semantic.tekst-podstawowy",
        "rdzen.semantic.tekst-drugorzedny",
        "rdzen.semantic.typografia-podpis",
        "rdzen.typografia.rozmiar-drobny",
        "rdzen.typografia.rodzina-o-stalej-szerokosci",
        "rdzen.typografia.grubosc-srednia",
        "rdzen.rozmiar.ikona-maly",
        "rdzen.semantic.tlo-wyciszone",
        "rdzen.semantic.tlo-akcent-subtelne",
        "rdzen.semantic.akcja-podstawowa",
        "rdzen.semantic.obwodka-skupienie",
        "rdzen.rozmiar.obwodka-srednia"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "row",
          "children": [
            "numer",
            "komorka-nazwa",
            "komorka-stan",
            "ikona-wejscia"
          ],
          "bind": {
            "background": {
              "token": "rdzen.funkcjonalne.tabela-wiersz-tlo"
            },
            "borderColor": {
              "token": "rdzen.funkcjonalne.tabela-obwodka"
            },
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "paddingY": {
              "token": "rdzen.rozmiar.odstep-050"
            },
            "height": {
              "literal": "44px"
            },
            "paddingX": {
              "literal": "12px"
            },
            "borderWidth": {
              "literal": "1px"
            }
          }
        },
        {
          "id": "numer",
          "element": "text",
          "textFrom": "props.numer.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "fontSize": {
              "token": "rdzen.typografia.rozmiar-drobny"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-o-stalej-szerokosci"
            }
          }
        },
        {
          "id": "komorka-nazwa",
          "element": "text",
          "textFrom": "props.nazwa.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            }
          }
        },
        {
          "id": "komorka-stan",
          "element": "text",
          "textFrom": "props.stan.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            }
          }
        },
        {
          "id": "ikona-wejscia",
          "element": "icon",
          "iconName": "strzalka-prawo",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-maly"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-maly"
            }
          }
        }
      ],
      "variants": {
        "tlo": {
          "naprzemienne": {
            "root": {
              "background": {
                "token": "rdzen.funkcjonalne.tabela-wiersz-naprzemienny"
              }
            }
          }
        }
      },
      "states": {
        "najechanie": {
          "root": {
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            }
          }
        },
        "zaznaczony": {
          "root": {
            "background": {
              "token": "rdzen.semantic.tlo-akcent-subtelne"
            },
            "borderColor": {
              "token": "rdzen.semantic.akcja-podstawowa"
            }
          }
        },
        "skupienie": {
          "root": {
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            }
          }
        }
      }
    }
  },
  "znacznik": {
    "osie": {
      "ton": [
        "neutralny",
        "sukces",
        "ostrzezenie",
        "blad"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "ton",
          "type": "enum",
          "enum": [
            "neutralny",
            "sukces",
            "ostrzezenie",
            "blad"
          ],
          "required": false,
          "default": "neutralny",
          "description": "Znaczenie etykiety: neutralny dla kategorii i tagów, trzy pozostałe wyłącznie dla stanu rekordu, nigdy dla dekoracji."
        },
        {
          "name": "etykieta",
          "type": "string",
          "required": true,
          "default": "Aktywny",
          "description": "Jedno lub dwa słowa nazywające stan albo kategorię; próbka renderu bierze wartość domyślną."
        },
        {
          "name": "zKropka",
          "type": "boolean",
          "required": false,
          "default": true,
          "description": "Pokazuje kropkę tonu przed etykietą. Wyłączana tylko tam, gdzie znaczniki stoją w jednej kolumnie tabeli i kropka powtarzałaby się w każdym wierszu."
        }
      ],
      "states": {
        "spoczynek": "Jedyny stan komponentu. Znacznik nie reaguje na wskaźnik i nie przyjmuje skupienia, więc nie ma najechania, wciśnięcia ani blokady — wygląd zmienia się wyłącznie przez zmianę tonu albo etykiety."
      },
      "behavior": {
        "dlugoscTresci": "Etykieta jest jednowierszowa. Tekst szerszy niż komórka jest przycinany wielokropkiem wyłącznie wizualnie — pełna treść zostaje w drzewie dokumentu. Znacznik nie rośnie na drugi wiersz, bo zmieniłby wysokość wiersza tabeli; przycięcie jest sygnałem, że etykietę trzeba skrócić u źródła.",
        "kropkaTonu": "Kropka powtarza ton kolorem treści, więc różnica między sukcesem, ostrzeżeniem i błędem nie opiera się wyłącznie na barwie tła; przy wyłączonej kropce ton musi być zdublowany w samej etykiecie.",
        "brakInterakcji": "Znacznik nie reaguje na kliknięcie i nie wchodzi w kolejność Tab. Filtrowanie po kliknięciu w znacznik należy do listy rozwijanej filtrów, nie do tego komponentu.",
        "liczbaWRzedzie": "W jednej komórce mieszczą się najwyżej trzy znaczniki; nadmiar jest zwijany do plakietki z liczbą pozostałych, żeby wiersz nie zmieniał wysokości.",
        "wysokoscStala": "Wysokość jest stała niezależnie od długości etykiety i od obecności kropki, dzięki czemu znaczniki w kolumnie tabeli tworzą równą linię."
      },
      "a11y": {
        "rola": "brak roli interaktywnej; treść trafia do drzewa dostępności jako zwykły tekst w miejscu osadzenia, a kropka jest ukryta przed czytnikiem.",
        "klawiatura": "Komponent nie przyjmuje skupienia i jest pomijany przez Tab. Przycięcie wielokropkiem jest wyłącznie wizualne, więc etykieta pozostaje w całości dostępna dla czytnika ekranu.",
        "czytnikEkranu": "Ton nie jest ogłaszany osobno — czytnik przeczyta „Aktywny”, nie „zielony”. Dlatego etykieta musi nieść znaczenie samodzielnie, a nie liczyć na kolor.",
        "kontrast": "Każda para tła i treści tonu trzyma kontrast co najmniej 4,5 do 1; cienka obwódka subtelna oddziela tło neutralne od tła wyciszonego wiersza tabeli, gdzie same wypełnienia byłyby nie do rozróżnienia."
      },
      "tokenConsumption": [
        "rdzen.komponent.znacznik-tlo",
        "rdzen.komponent.znacznik-tresc",
        "rdzen.semantic.stan-sukces-tlo",
        "rdzen.semantic.stan-sukces-tresc",
        "rdzen.semantic.stan-ostrzezenie-tlo",
        "rdzen.semantic.stan-ostrzezenie-tresc",
        "rdzen.semantic.stan-blad-tlo",
        "rdzen.semantic.stan-blad-tresc",
        "rdzen.semantic.obwodka-subtelna",
        "rdzen.semantic.promien-pelny",
        "rdzen.semantic.odstep-przylegly",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.semantic.typografia-podpis",
        "rdzen.rozmiar.odstep-100",
        "rdzen.rozmiar.odstep-300",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.typografia.grubosc-srednia",
        "rdzen.typografia.wysokosc-ciasna",
        "rdzen.typografia.rodzina-podstawowa"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "box",
          "children": [
            "kropka",
            "etykieta"
          ],
          "bind": {
            "background": {
              "token": "rdzen.komponent.znacznik-tlo"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-300"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-przylegly"
            },
            "gap": {
              "token": "rdzen.semantic.odstep-przylegly"
            },
            "radius": {
              "token": "rdzen.semantic.promien-pelny"
            }
          }
        },
        {
          "id": "kropka",
          "element": "box",
          "bind": {
            "background": {
              "token": "rdzen.komponent.znacznik-tresc"
            },
            "width": {
              "token": "rdzen.rozmiar.odstep-100"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-100"
            },
            "radius": {
              "token": "rdzen.semantic.promien-pelny"
            }
          }
        },
        {
          "id": "etykieta",
          "element": "text",
          "textFrom": "props.etykieta.default",
          "bind": {
            "color": {
              "token": "rdzen.komponent.znacznik-tresc"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        }
      ],
      "variants": {
        "ton": {
          "sukces": {
            "root": {
              "background": {
                "token": "rdzen.semantic.stan-sukces-tlo"
              }
            },
            "kropka": {
              "background": {
                "token": "rdzen.semantic.stan-sukces-tresc"
              }
            },
            "etykieta": {
              "color": {
                "token": "rdzen.semantic.stan-sukces-tresc"
              }
            }
          },
          "ostrzezenie": {
            "root": {
              "background": {
                "token": "rdzen.semantic.stan-ostrzezenie-tlo"
              }
            },
            "kropka": {
              "background": {
                "token": "rdzen.semantic.stan-ostrzezenie-tresc"
              }
            },
            "etykieta": {
              "color": {
                "token": "rdzen.semantic.stan-ostrzezenie-tresc"
              }
            }
          },
          "blad": {
            "root": {
              "background": {
                "token": "rdzen.semantic.stan-blad-tlo"
              }
            },
            "kropka": {
              "background": {
                "token": "rdzen.semantic.stan-blad-tresc"
              }
            },
            "etykieta": {
              "color": {
                "token": "rdzen.semantic.stan-blad-tresc"
              }
            }
          }
        }
      }
    }
  },
  "plakietka": {
    "osie": {
      "ton": [
        "neutralny",
        "akcent"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "ton",
          "type": "enum",
          "enum": [
            "neutralny",
            "akcent"
          ],
          "required": false,
          "default": "neutralny",
          "description": "Neutralny dla liczników informacyjnych (nieprzeczytane wiadomości), akcent dla rzeczy wymagających reakcji użytkownika (zaproszenia, zadania po terminie)."
        },
        {
          "name": "liczba",
          "type": "number",
          "required": true,
          "default": 12,
          "description": "Liczba pozycji pokazywana przy elemencie nawigacji; ta sama wartość trafia do próbki renderu."
        },
        {
          "name": "maksimum",
          "type": "number",
          "required": false,
          "default": 99,
          "description": "Próg skracania. Wartości powyżej progu są zapisywane jako próg z plusem, żeby plakietka nie rozpychała paska nawigacji przy tysiącach pozycji."
        }
      ],
      "states": {
        "spoczynek": "Owalne pole z liczbą, obwódka w kolorze powierzchni odcina plakietkę od ikony, na którą nachodzi.",
        "ukryta": "Liczba równa zero — plakietka wychodzi z układu i nie zostawia po sobie pustego miejsca, więc element nawigacji wraca na swoją naturalną pozycję. Przepis oddaje ten stan pełną przezroczystością, bo słownik właściwości nie ma sposobu na usunięcie węzła z drzewa."
      },
      "behavior": {
        "przepelnienie": "Wartości powyżej progu maksimum są skracane do zapisu z plusem. Szerokość rośnie wraz z liczbą znaków, wysokość zostaje stała — dlatego promień jest pełny, a nie stały w pikselach.",
        "zeroUkrywa": "Zero nie jest renderowane. Pokazywanie zerowego licznika czyta się jak nowa pozycja i generuje fałszywe kliknięcia.",
        "kotwiczenie": "Plakietka jest umieszczana przy prawym górnym rogu elementu nawigacji i częściowo na niego nachodzi; obwódka w kolorze powierzchni tworzy prześwit, dzięki któremu cyfry pozostają czytelne nad kreską ikony.",
        "brakPrzechwytywaniaWskaznika": "Kliknięcie w plakietkę trafia w element nawigacji pod spodem — plakietka nie jest osobnym celem i nie ma własnej akcji.",
        "aktualizacjaBezAnimacji": "Zmiana liczby nie jest animowana — szerokość przeskakuje od razu do nowej wartości. Płynne rozsuwanie ciągnęłoby wzrok do paska nawigacji przy każdym przyroście licznika."
      },
      "a11y": {
        "rola": "brak własnej roli; liczba jest doklejana do dostępnej nazwy elementu nawigacji, więc czytnik ogłasza „Powiadomienia, 12 nowych”, a nie „Powiadomienia” i osobno „12”.",
        "klawiatura": "Plakietka nie przyjmuje skupienia i jest pomijana przez Tab — skupienie zatrzymuje się na elemencie nawigacji, do którego jest przypięta.",
        "czytnikEkranu": "Znak plusa nie jest odczytywany dosłownie; dla wartości skróconej czytnik dostaje pełne rozwinięcie w rodzaju „ponad 99 nowych”.",
        "aktualizacje": "Zmiana licznika jest ogłaszana grzecznie (aria-live równe polite) i tylko dla widocznego elementu nawigacji; zmiany w tle są ciche, żeby czytnik nie przerywał czytania treści strony.",
        "kontrast": "Cyfry na tle akcentu trzymają kontrast co najmniej 4,5 do 1 mimo małego stopnia pisma; dlatego grubość jest pogrubiona, a nie średnia jak w znaczniku."
      },
      "tokenConsumption": [
        "rdzen.semantic.tlo-wyciszone",
        "rdzen.semantic.tlo-powierzchnia",
        "rdzen.semantic.akcja-podstawowa",
        "rdzen.semantic.tekst-podstawowy",
        "rdzen.semantic.tekst-odwrocony",
        "rdzen.semantic.promien-pelny",
        "rdzen.semantic.odstep-przylegly",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.rozmiar.odstep-250",
        "rdzen.rozmiar.obwodka-srednia",
        "rdzen.typografia.rozmiar-drobny",
        "rdzen.typografia.grubosc-pogrubiona",
        "rdzen.typografia.wysokosc-ciasna",
        "rdzen.typografia.rodzina-podstawowa",
        "rdzen.krycie.przezroczyste"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "box",
          "children": [
            "liczba"
          ],
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            },
            "borderColor": {
              "token": "rdzen.semantic.tlo-powierzchnia"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-250"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-przylegly"
            },
            "radius": {
              "token": "rdzen.semantic.promien-pelny"
            }
          }
        },
        {
          "id": "liczba",
          "element": "text",
          "textFrom": "props.liczba.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "fontSize": {
              "token": "rdzen.typografia.rozmiar-drobny"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-pogrubiona"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        }
      ],
      "variants": {
        "ton": {
          "akcent": {
            "root": {
              "background": {
                "token": "rdzen.semantic.akcja-podstawowa"
              }
            },
            "liczba": {
              "color": {
                "token": "rdzen.semantic.tekst-odwrocony"
              }
            }
          }
        }
      },
      "states": {
        "ukryta": {
          "root": {
            "opacity": {
              "token": "rdzen.krycie.przezroczyste"
            }
          }
        }
      }
    }
  },
  "awatar": {
    "osie": {
      "rozmiar": [
        "maly",
        "sredni",
        "duzy"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "rozmiar",
          "type": "enum",
          "enum": [
            "maly",
            "sredni",
            "duzy"
          ],
          "required": true,
          "default": "sredni",
          "description": "Średnica kółka: mały (24 piksele) do wiersza tabeli i listy, średni (40) do nagłówka komentarza, duży (48) do karty profilu."
        },
        {
          "name": "inicjaly",
          "type": "string",
          "required": true,
          "default": "ZO",
          "description": "Jeden lub dwa znaki rysowane w kółku, gdy nie ma obrazu; próbka renderu bierze wartość domyślną, czyli skrót domyślnej nazwy."
        },
        {
          "name": "nazwa",
          "type": "string",
          "required": true,
          "default": "Zespół obsługi zamówień",
          "description": "Pełna nazwa osoby lub zespołu. Trafia do tekstu alternatywnego, nigdy na kółko."
        },
        {
          "name": "obraz",
          "type": "string",
          "required": false,
          "default": "",
          "description": "Adres zdjęcia. Puste pole albo błąd pobrania przełącza kółko na inicjały, bez pustego kadru w międzyczasie."
        }
      ],
      "states": {},
      "behavior": {
        "zrodloTresci": "Kolejność jest sztywna: obraz z propu obraz, przy jego braku lub błędzie pobrania inicjały, a gdy i one są puste — dwie pierwsze litery propu nazwa (dla wartości domyślnych daje to te same znaki, ZO).",
        "przycinanieInicjalow": "Kółko rysuje najwyżej dwa znaki; dłuższa wartość jest ucinana, żeby litery nie wychodziły poza okrąg przy rozmiarze maly (24 piksele).",
        "kadrowanieObrazu": "Zdjęcie jest kadrowane do kwadratu od środka i przycinane promieniem pełnym; węższy plik jest wyśrodkowany, nigdy rozciągany.",
        "brakInterakcji": "Awatar niczego nie obsługuje — nie ma kliknięcia, najechania ani skupienia, dlatego nie deklaruje żadnego stanu. Gdy ma prowadzić do profilu, opakowuje się go linkiem lub przyciskiem ikonowym, który wnosi własne stany i rolę."
      },
      "a11y": {
        "rola": "img",
        "czytnikEkranu": "Tekstem alternatywnym jest wartość propu nazwa. Same inicjały nie są odczytywane nigdy — poza kontekstem dwie litery nic nie znaczą.",
        "powtorzenieTresci": "Gdy awatar stoi w jednym wierszu z wypisaną nazwą tej samej osoby lub tego samego zespołu, dostaje aria-hidden, żeby czytnik nie ogłaszał jej dwa razy.",
        "kontrast": "Para inicjały–tło (tekst podstawowy na tle akcentu subtelnego) trzyma 4,5:1 i jest sprawdzana bramką kontrastu po każdej podmianie kolorów przez markę; obwódka subtelna oddziela kółko od jasnej powierzchni pod spodem."
      },
      "tokenConsumption": [
        "rdzen.rozmiar.odstep-300",
        "rdzen.rozmiar.odstep-500",
        "rdzen.rozmiar.odstep-600",
        "rdzen.semantic.promien-pelny",
        "rdzen.semantic.tlo-akcent-subtelne",
        "rdzen.semantic.obwodka-subtelna",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.semantic.tekst-podstawowy",
        "rdzen.semantic.typografia-tresc",
        "rdzen.semantic.typografia-tresc-duza",
        "rdzen.typografia.rozmiar-drobny",
        "rdzen.typografia.grubosc-srednia",
        "rdzen.typografia.wysokosc-ciasna",
        "rdzen.typografia.rodzina-podstawowa"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "box",
          "children": [
            "inicjaly"
          ],
          "bind": {
            "width": {
              "token": "rdzen.rozmiar.odstep-500"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-500"
            },
            "radius": {
              "token": "rdzen.semantic.promien-pelny"
            },
            "background": {
              "token": "rdzen.semantic.tlo-akcent-subtelne"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            }
          }
        },
        {
          "id": "inicjaly",
          "element": "text",
          "textFrom": "props.inicjaly.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        }
      ],
      "variants": {
        "rozmiar": {
          "maly": {
            "root": {
              "width": {
                "token": "rdzen.rozmiar.odstep-300"
              },
              "height": {
                "token": "rdzen.rozmiar.odstep-300"
              }
            },
            "inicjaly": {
              "fontSize": {
                "token": "rdzen.typografia.rozmiar-drobny"
              }
            }
          },
          "sredni": {
            "root": {
              "width": {
                "token": "rdzen.rozmiar.odstep-500"
              },
              "height": {
                "token": "rdzen.rozmiar.odstep-500"
              }
            },
            "inicjaly": {
              "fontSize": {
                "token": "rdzen.semantic.typografia-tresc"
              }
            }
          },
          "duzy": {
            "root": {
              "width": {
                "token": "rdzen.rozmiar.odstep-600"
              },
              "height": {
                "token": "rdzen.rozmiar.odstep-600"
              }
            },
            "inicjaly": {
              "fontSize": {
                "token": "rdzen.semantic.typografia-tresc-duza"
              }
            }
          }
        }
      }
    }
  },
  "okno-dialogowe": {
    "osie": {
      "rozmiar": [
        "male",
        "srednie",
        "duze"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "rozmiar",
          "type": "enum",
          "enum": [
            "male",
            "srednie",
            "duze"
          ],
          "required": true,
          "default": "srednie",
          "description": "Szerokość okna: małe do potwierdzeń jednym zdaniem, średnie do krótkich formularzy, duże do treści z własnym przewijaniem."
        },
        {
          "name": "tytul",
          "type": "string",
          "required": true,
          "default": "Usunąć raport?",
          "description": "Pytanie lub nazwa decyzji; ma być zrozumiały bez czytania treści okna."
        },
        {
          "name": "tresc",
          "type": "string",
          "required": true,
          "default": "Raport zniknie z listy zespołu i nie da się go przywrócić.",
          "description": "Skutek decyzji opisany wprost, razem z tym, czego nie da się cofnąć."
        },
        {
          "name": "etykietaPotwierdzenia",
          "type": "string",
          "required": true,
          "default": "Usuń",
          "description": "Czasownik nazywający skutek; nigdy samo „OK”, bo etykieta bywa czytana bez kontekstu tytułu."
        },
        {
          "name": "etykietaAnulowania",
          "type": "string",
          "required": true,
          "default": "Anuluj",
          "description": "Wyjście bez skutków; ten przycisk dostaje skupienie jako pierwszy przy oknach niszczących."
        },
        {
          "name": "etykietaZamkniecia",
          "type": "string",
          "required": true,
          "default": "Zamknij okno",
          "description": "Tekst etykiety przycisku z krzyżykiem w pasku tytułu; sama ikona nie niesie znaczenia dla czytnika ekranu."
        },
        {
          "name": "zamykanieKlawiszemEscape",
          "type": "boolean",
          "required": false,
          "default": true,
          "description": "Fałsz wyłącza klawisz Escape — stosowane tam, gdzie zamknięcie zgubiłoby wprowadzone dane; wyjściem zostają wtedy przyciski stopki i krzyżyk."
        }
      ],
      "states": {
        "zamkniete": "Okno nie jest renderowane, nakładki nie ma, przewijanie strony wraca, a skupienie wraca na element, który okno otworzył.",
        "otwarte": "Okno leży nad nakładką przykrywającą stronę; skupienie jest uwięzione w jego granicach, a treść pod spodem ma aria-hidden.",
        "przetwarzanie": "Po potwierdzeniu przycisk akcji przestaje przyjmować kliknięcia, a jego tło przechodzi na kolor akcji wyłączonej; Escape i kliknięcie w nakładkę są w tym czasie wstrzymane, żeby nie porzucić żądania w locie."
      },
      "behavior": {
        "pulapkaSkupienia": "Tab i Shift+Tab krążą wyłącznie po elementach okna; z ostatniego przycisku skupienie wraca na pierwszy, nie na treść strony.",
        "zwrotSkupienia": "Po zamknięciu skupienie wraca dokładnie na element, który okno wywołał; gdy ten element zniknął — na jego najbliższy kontener z nagłówkiem.",
        "zamkniecieNakladka": "Kliknięcie w nakładkę zamyka okno informacyjne. Okno decyzji wymaga wyboru jednego z przycisków stopki, więc nakładka nie jest wtedy wyjściem.",
        "przewijanie": "Strona pod nakładką ma zablokowane przewijanie; gdy treść nie mieści się w oknie, przewija się wyłącznie obszar między paskiem tytułu a stopką, a oba pasy zostają widoczne."
      },
      "a11y": {
        "rola": "Element dialog z aria-modal=true; aria-labelledby wskazuje tytuł, aria-describedby akapit treści.",
        "klawiatura": "Escape zamyka, gdy zamykanieKlawiszemEscape=true. Po otwarciu skupienie startuje na przycisku anulowania, a nie na krzyżyku w rogu, żeby odruchowy Enter nie wywołał akcji niszczącej.",
        "czytnikEkranu": "Po otwarciu czytany jest tytuł, potem treść; przycisk krzyżyka bierze etykietę tekstową z props.etykietaZamkniecia, bo sama ikona jej nie niesie."
      },
      "tokenConsumption": [
        "rdzen.semantic.tlo-odwrocone",
        "rdzen.semantic.tlo-powierzchnia",
        "rdzen.semantic.tekst-drugorzedny",
        "rdzen.semantic.akcja-wylaczona",
        "rdzen.semantic.obwodka-subtelna",
        "rdzen.semantic.obwodka-wyrazna",
        "rdzen.semantic.promien-powierzchnia",
        "rdzen.semantic.promien-interakcja",
        "rdzen.semantic.odstep-zwykly",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.semantic.odstep-przylegly",
        "rdzen.semantic.typografia-naglowek-4",
        "rdzen.semantic.typografia-podpis",
        "rdzen.semantic.typografia-przycisk",
        "rdzen.komponent.okno-tlo",
        "rdzen.komponent.okno-naglowek",
        "rdzen.komponent.przycisk-tlo",
        "rdzen.komponent.przycisk-tresc",
        "rdzen.komponent.przycisk-tresc-odwrocona",
        "rdzen.typografia.grubosc-pogrubiona",
        "rdzen.typografia.grubosc-srednia",
        "rdzen.typografia.wysokosc-zwarta",
        "rdzen.typografia.wysokosc-zwykla",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.rozmiar.odstep-300",
        "rdzen.rozmiar.odstep-400",
        "rdzen.rozmiar.odstep-500",
        "rdzen.rozmiar.odstep-600",
        "rdzen.rozmiar.ikona-maly"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "box",
          "children": [
            "okno"
          ],
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-odwrocone"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "radius": {
              "token": "rdzen.semantic.promien-powierzchnia"
            },
            "width": {
              "token": "rdzen.rozmiar.odstep-600"
            }
          }
        },
        {
          "id": "okno",
          "element": "stack",
          "children": [
            "pasekTytulu",
            "tresc",
            "stopka"
          ],
          "bind": {
            "background": {
              "token": "rdzen.komponent.okno-tlo"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "radius": {
              "token": "rdzen.semantic.promien-powierzchnia"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "width": {
              "token": "rdzen.rozmiar.odstep-400"
            }
          }
        },
        {
          "id": "pasekTytulu",
          "element": "row",
          "children": [
            "tytul",
            "zamknij"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-zwykly"
            }
          }
        },
        {
          "id": "tytul",
          "element": "text",
          "textFrom": "props.tytul.default",
          "bind": {
            "color": {
              "token": "rdzen.komponent.okno-naglowek"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-naglowek-4"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-pogrubiona"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwarta"
            }
          }
        },
        {
          "id": "zamknij",
          "element": "icon",
          "iconName": "krzyzyk",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-maly"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-maly"
            }
          }
        },
        {
          "id": "tresc",
          "element": "text",
          "textFrom": "props.tresc.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwykla"
            }
          }
        },
        {
          "id": "stopka",
          "element": "row",
          "children": [
            "anuluj",
            "potwierdz"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            }
          }
        },
        {
          "id": "anuluj",
          "element": "box",
          "children": [
            "anulujTekst"
          ],
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-powierzchnia"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-wyrazna"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-przylegly"
            }
          }
        },
        {
          "id": "anulujTekst",
          "element": "text",
          "textFrom": "props.etykietaAnulowania.default",
          "bind": {
            "color": {
              "token": "rdzen.komponent.przycisk-tresc"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-przycisk"
            }
          }
        },
        {
          "id": "potwierdz",
          "element": "box",
          "children": [
            "potwierdzTekst"
          ],
          "bind": {
            "background": {
              "token": "rdzen.komponent.przycisk-tlo"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-przylegly"
            }
          }
        },
        {
          "id": "potwierdzTekst",
          "element": "text",
          "textFrom": "props.etykietaPotwierdzenia.default",
          "bind": {
            "color": {
              "token": "rdzen.komponent.przycisk-tresc-odwrocona"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-przycisk"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            }
          }
        }
      ],
      "variants": {
        "rozmiar": {
          "male": {
            "okno": {
              "width": {
                "token": "rdzen.rozmiar.odstep-300"
              },
              "paddingX": {
                "token": "rdzen.semantic.odstep-ciasny"
              },
              "paddingY": {
                "token": "rdzen.semantic.odstep-ciasny"
              }
            }
          },
          "duze": {
            "okno": {
              "width": {
                "token": "rdzen.rozmiar.odstep-500"
              },
              "gap": {
                "token": "rdzen.semantic.odstep-zwykly"
              }
            }
          }
        }
      },
      "states": {
        "przetwarzanie": {
          "potwierdz": {
            "background": {
              "token": "rdzen.semantic.akcja-wylaczona"
            }
          }
        }
      }
    }
  },
  "panel-boczny": {
    "osie": {
      "strona": [
        "lewa",
        "prawa"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "strona",
          "type": "enum",
          "enum": [
            "lewa",
            "prawa"
          ],
          "required": true,
          "default": "lewa",
          "description": "Krawędź, od której panel się wsuwa; ta sama krawędź jest kierunkiem wycofania przy zamykaniu."
        },
        {
          "name": "tytul",
          "type": "string",
          "required": true,
          "default": "Filtry wyników",
          "description": "Nazwa zadania, które panel obsługuje; jest pierwszym elementem czytanym po otwarciu."
        },
        {
          "name": "tresc",
          "type": "string",
          "required": true,
          "default": "Zawęź listę po statusie, dacie i właścicielu.",
          "description": "Wprowadzenie do zawartości panelu; poniżej niego stoją właściwe kontrolki."
        },
        {
          "name": "zNakladka",
          "type": "boolean",
          "required": false,
          "default": true,
          "description": "Prawda kładzie na stronę półprzezroczystą nakładkę i blokuje ją na czas pracy w panelu; fałsz zostawia stronę czynną, a panel zabiera jej część szerokości."
        },
        {
          "name": "etykietaZamkniecia",
          "type": "string",
          "required": true,
          "default": "Zamknij panel",
          "description": "Tekst etykiety przycisku z krzyżykiem; sama ikona nie niesie znaczenia dla czytnika ekranu."
        }
      ],
      "states": {
        "zamkniety": "Panel stoi poza krawędzią ekranu, jest wyłączony z kolejności Tab i z drzewa dostępności; przyciemnienie strony znika razem z nim.",
        "otwarty": "Panel wsunięty do końca ze stałą szerokością; przy zNakladka=true strona za nim jest przyciemniona do połowy krycia i zablokowana, przy fałszu pozostaje czynna."
      },
      "behavior": {
        "kierunekWsuwania": "Panel wjeżdża i wyjeżdża prostopadle do krawędzi wskazanej przez strona; nie zmienia przy tym szerokości, więc treść w środku nie przelicza układu w trakcie ruchu.",
        "pulapkaSkupienia": "Przy zNakladka=true Tab krąży wewnątrz panelu. Przy zNakladka=false skupienie normalnie wychodzi z panelu do treści strony, bo strona pozostaje czynna.",
        "zwrotSkupienia": "Po zamknięciu skupienie wraca na przycisk, który panel otworzył — także wtedy, gdy panel zamknięto klawiszem Escape.",
        "przewijanieWlasne": "Pasek tytułu z krzyżykiem zostaje przyklejony do góry, przewija się wyłącznie obszar treści; przewijanie strony za panelem jest blokowane tylko przy nakładce."
      },
      "a11y": {
        "rola": "Element dialog z aria-modal=true przy zNakladka=true; przy zNakladka=false element complementary, bo panel nie przerywa pracy ze stroną.",
        "klawiatura": "Escape zamyka panel w obu ustawieniach nakładki. Po otwarciu skupienie ląduje na nagłówku panelu, który dostaje tabindex=-1, żeby czytnik przeczytał kontekst przed pierwszą kontrolką.",
        "czytnikEkranu": "aria-labelledby wskazuje tytuł panelu; przycisk zamknięcia bierze etykietę z props.etykietaZamkniecia, a przyciemniona strona dostaje aria-hidden tylko przy nakładce."
      },
      "tokenConsumption": [
        "rdzen.semantic.tlo-strona",
        "rdzen.semantic.tlo-odwrocone",
        "rdzen.semantic.tlo-powierzchnia",
        "rdzen.semantic.tekst-podstawowy",
        "rdzen.semantic.tekst-drugorzedny",
        "rdzen.semantic.obwodka-subtelna",
        "rdzen.semantic.odstep-zwykly",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.semantic.typografia-naglowek-4",
        "rdzen.semantic.typografia-podpis",
        "rdzen.typografia.grubosc-pogrubiona",
        "rdzen.typografia.wysokosc-zwykla",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.rozmiar.odstep-000",
        "rdzen.rozmiar.odstep-200",
        "rdzen.rozmiar.odstep-400",
        "rdzen.rozmiar.odstep-600",
        "rdzen.rozmiar.ikona-maly",
        "rdzen.krycie.polowa",
        "rdzen.krycie.przezroczyste"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "row",
          "children": [
            "przyciemnienieLewe",
            "panel",
            "przyciemnieniePrawe"
          ],
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-strona"
            },
            "gap": {
              "token": "rdzen.rozmiar.odstep-000"
            },
            "width": {
              "token": "rdzen.rozmiar.odstep-600"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-600"
            }
          }
        },
        {
          "id": "przyciemnienieLewe",
          "element": "spacer",
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-strona"
            },
            "opacity": {
              "token": "rdzen.krycie.polowa"
            },
            "width": {
              "token": "rdzen.rozmiar.odstep-000"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-600"
            }
          }
        },
        {
          "id": "panel",
          "element": "stack",
          "children": [
            "pasekTytulu",
            "tresc"
          ],
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-powierzchnia"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "width": {
              "token": "rdzen.rozmiar.odstep-400"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-600"
            }
          }
        },
        {
          "id": "pasekTytulu",
          "element": "row",
          "children": [
            "tytul",
            "zamknij"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            }
          }
        },
        {
          "id": "tytul",
          "element": "text",
          "textFrom": "props.tytul.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-naglowek-4"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-pogrubiona"
            }
          }
        },
        {
          "id": "zamknij",
          "element": "icon",
          "iconName": "krzyzyk",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-maly"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-maly"
            }
          }
        },
        {
          "id": "tresc",
          "element": "text",
          "textFrom": "props.tresc.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwykla"
            }
          }
        },
        {
          "id": "przyciemnieniePrawe",
          "element": "spacer",
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-odwrocone"
            },
            "opacity": {
              "token": "rdzen.krycie.polowa"
            },
            "width": {
              "token": "rdzen.rozmiar.odstep-200"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-600"
            }
          }
        }
      ],
      "variants": {
        "strona": {
          "prawa": {
            "przyciemnienieLewe": {
              "background": {
                "token": "rdzen.semantic.tlo-odwrocone"
              },
              "width": {
                "token": "rdzen.rozmiar.odstep-200"
              }
            },
            "przyciemnieniePrawe": {
              "background": {
                "token": "rdzen.semantic.tlo-strona"
              },
              "width": {
                "token": "rdzen.rozmiar.odstep-000"
              }
            }
          }
        }
      },
      "states": {
        "zamkniety": {
          "panel": {
            "opacity": {
              "token": "rdzen.krycie.przezroczyste"
            }
          },
          "przyciemnienieLewe": {
            "background": {
              "token": "rdzen.semantic.tlo-strona"
            }
          },
          "przyciemnieniePrawe": {
            "background": {
              "token": "rdzen.semantic.tlo-strona"
            }
          }
        }
      }
    }
  },
  "naglowek-strony": {
    "osie": {
      "uklad": [
        "pelny",
        "zwarty"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "uklad",
          "type": "enum",
          "enum": [
            "pelny",
            "zwarty"
          ],
          "required": true,
          "default": "pelny",
          "description": "Pełny pokazuje ścieżkę, tytuł, opis i akcję; zwarty zostawia tytuł z akcją w jednym wierszu, schodzi o jeden stopień skali nagłówków i skraca dopełnienie pionowe."
        },
        {
          "name": "tytul",
          "type": "string",
          "required": true,
          "default": "Wykaz pozycji",
          "description": "Nazwa strony renderowana jako nagłówek poziomu pierwszego; próbka renderu wypisuje wartość domyślną."
        },
        {
          "name": "sciezka",
          "type": "string",
          "required": false,
          "default": "Katalog / Pozycje",
          "description": "Ścieżka położenia wypisywana nad tytułem; w złożonej stronie miejsce to zajmuje komponent okruszków, a ten prop niesie jej spłaszczoną postać na potrzeby próbki renderu. W układzie zwartym ścieżka schodzi z widoku, bo powiela nawigację boczną."
        },
        {
          "name": "opis",
          "type": "string",
          "required": false,
          "default": "Dane odświeżane co pięć minut",
          "description": "Jedno zdanie doprecyzowujące zakres strony; w układzie zwartym pomijane."
        },
        {
          "name": "akcjaGlowna",
          "type": "string",
          "required": false,
          "default": "Dodaj",
          "description": "Etykieta pierwszej akcji kontekstowej; bez niej pasek tytułu zwęża się do samego tytułu."
        },
        {
          "name": "akcjeDodatkowe",
          "type": "number",
          "required": false,
          "default": 0,
          "description": "Liczba akcji poza pierwszą; powyżej zera zwijają się do menu, gdy zabraknie szerokości."
        }
      ],
      "states": {
        "spoczynek": "Nagłówek płynie razem z treścią strony: pełne dopełnienie pionowe, tło powierzchni, obwódka ledwie odcinająca go od treści poniżej.",
        "przypiety": "Strona przewinięta poniżej nagłówka: pasek trzyma się górnej krawędzi widoku, dopełnienie pionowe spada do jednego kroku skali, tło przechodzi na wyniesione, a obwódka mocnieje, żeby oddzielić go od przesuwającej się treści."
      },
      "behavior": {
        "przypinanie": "Przyklejenie włącza się dopiero, gdy dolna krawędź nagłówka minie górną krawędź widoku; ścieżka i opis zwijają się wtedy jako pierwsze, tytuł i akcja zostają.",
        "lamanieTytulu": "Tytuł zawija się najwyżej do dwóch wierszy, dalej jest ucinany wielokropkiem; przycisk akcji nie kurczy się poniżej szerokości swojej etykiety i nie schodzi do drugiego wiersza.",
        "akcje": "Pierwsza akcja jest widoczna zawsze; kolejne przechodzą do menu po przekroczeniu progu wąskiego widoku, a ich kolejność w menu zgadza się z kolejnością na pasku."
      },
      "a11y": {
        "rola": "header dla całego bloku, tytuł jako h1, ścieżka w nav z etykietą „Ścieżka nawigacyjna”.",
        "klawiatura": "Tab prowadzi kolejno przez ogniwa ścieżki, a potem przez akcje; sam nagłówek skupienia nie przyjmuje, więc przypięcie nie zmienia kolejności przystanków.",
        "czytnikEkranu": "H1 jest celem skoku po nagłówkach na stronie; opis powiązany z tytułem przez aria-describedby, dzięki czemu jest czytany razem z nim, a nie jako osobny akapit."
      },
      "tokenConsumption": [
        "rdzen.semantic.tlo-powierzchnia",
        "rdzen.semantic.tlo-wyniesione",
        "rdzen.semantic.obwodka-subtelna",
        "rdzen.semantic.obwodka-wyrazna",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.rozmiar.promien-zaden",
        "rdzen.semantic.odstep-zwykly",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.rozmiar.odstep-050",
        "rdzen.rozmiar.odstep-025",
        "rdzen.rozmiar.odstep-400",
        "rdzen.funkcjonalne.nawigacja-pozycja-tekst",
        "rdzen.typografia.rozmiar-drobny",
        "rdzen.semantic.tekst-podstawowy",
        "rdzen.semantic.tekst-drugorzedny",
        "rdzen.semantic.typografia-naglowek-3",
        "rdzen.semantic.typografia-naglowek-4",
        "rdzen.semantic.typografia-podpis",
        "rdzen.semantic.typografia-przycisk",
        "rdzen.typografia.grubosc-pogrubiona",
        "rdzen.typografia.grubosc-srednia",
        "rdzen.typografia.wysokosc-ciasna",
        "rdzen.typografia.wysokosc-zwykla",
        "rdzen.typografia.rodzina-podstawowa",
        "rdzen.komponent.przycisk-tlo",
        "rdzen.komponent.przycisk-tresc-odwrocona",
        "rdzen.semantic.promien-interakcja",
        "rdzen.krycie.przezroczyste"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "stack",
          "children": [
            "sciezka",
            "pasek",
            "opis"
          ],
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-powierzchnia"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "gap": {
              "token": "rdzen.rozmiar.odstep-050"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "radius": {
              "token": "rdzen.rozmiar.promien-zaden"
            }
          }
        },
        {
          "id": "sciezka",
          "element": "text",
          "textFrom": "props.sciezka.default",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.nawigacja-pozycja-tekst"
            },
            "fontSize": {
              "token": "rdzen.typografia.rozmiar-drobny"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            }
          }
        },
        {
          "id": "pasek",
          "element": "row",
          "children": [
            "tytul",
            "akcja"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-zwykly"
            }
          }
        },
        {
          "id": "tytul",
          "element": "text",
          "textFrom": "props.tytul.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-naglowek-3"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-pogrubiona"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        },
        {
          "id": "akcja",
          "element": "box",
          "children": [
            "akcja-etykieta"
          ],
          "bind": {
            "background": {
              "token": "rdzen.komponent.przycisk-tlo"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "paddingY": {
              "token": "rdzen.rozmiar.odstep-050"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-400"
            }
          }
        },
        {
          "id": "akcja-etykieta",
          "element": "text",
          "textFrom": "props.akcjaGlowna.default",
          "bind": {
            "color": {
              "token": "rdzen.komponent.przycisk-tresc-odwrocona"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-przycisk"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            }
          }
        },
        {
          "id": "opis",
          "element": "text",
          "textFrom": "props.opis.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwykla"
            }
          }
        }
      ],
      "variants": {
        "uklad": {
          "zwarty": {
            "root": {
              "paddingY": {
                "token": "rdzen.rozmiar.odstep-050"
              },
              "gap": {
                "token": "rdzen.rozmiar.odstep-025"
              }
            },
            "tytul": {
              "fontSize": {
                "token": "rdzen.semantic.typografia-naglowek-4"
              }
            },
            "sciezka": {
              "opacity": {
                "token": "rdzen.krycie.przezroczyste"
              }
            },
            "opis": {
              "opacity": {
                "token": "rdzen.krycie.przezroczyste"
              }
            }
          }
        }
      },
      "states": {
        "przypiety": {
          "root": {
            "background": {
              "token": "rdzen.semantic.tlo-wyniesione"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-wyrazna"
            },
            "paddingY": {
              "token": "rdzen.rozmiar.odstep-050"
            }
          }
        }
      }
    }
  },
  "stopka": {
    "osie": {
      "ton": [
        "zwykly",
        "odwrocony"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "ton",
          "type": "enum",
          "enum": [
            "zwykly",
            "odwrocony"
          ],
          "required": true,
          "default": "zwykly",
          "description": "Zwykły siada na wyciszonym tle strony; odwrócony kładzie stopkę na ciemnej powierzchni domykającej długi widok."
        },
        {
          "name": "linkPomoc",
          "type": "string",
          "required": false,
          "default": "Pomoc",
          "description": "Etykieta pierwszego odnośnika pomocniczego; próbka renderu wypisuje wartość domyślną."
        },
        {
          "name": "linkKontakt",
          "type": "string",
          "required": false,
          "default": "Kontakt",
          "description": "Etykieta drugiego odnośnika pomocniczego; próbka renderu wypisuje wartość domyślną."
        },
        {
          "name": "linkPrywatnosci",
          "type": "string",
          "required": false,
          "default": "Prywatność",
          "description": "Etykieta odnośnika do zasad przetwarzania danych; stoi zawsze jako ostatni w rzędzie."
        },
        {
          "name": "notaPrawna",
          "type": "string",
          "required": false,
          "default": "© 2026 Wszelkie prawa zastrzeżone",
          "description": "Zdanie zamykające dokument, umieszczone pod kreską; próbka renderu wypisuje wartość domyślną."
        },
        {
          "name": "linki",
          "type": "array",
          "required": false,
          "description": "Pełna lista odnośników pomocniczych, gdy trzeba ich więcej niż trzy; kolejność z listy jest kolejnością czytania."
        }
      ],
      "states": {
        "spoczynek": "Stopka na wyciszonym tle: odnośniki w jednym rzędzie w kolorze odnośnika, pod nimi kreska o grubości cienkiej obwódki, a pod kreską nota prawna w tekście drugorzędnym.",
        "najechanie": "Kursor nad odnośnikiem pomocniczym: jego kolor przechodzi na najechanie akcji podstawowej, pozostałe odnośniki, kreska i nota prawna zostają bez zmian.",
        "skupienie": "Odnośnik wskazany klawiaturą dostaje obwódkę skupienia z małym promieniem, rysowaną wokół samego tekstu, więc rząd odnośników nie rozpycha się ani nie przesuwa."
      },
      "behavior": {
        "ukladLinkow": "Odnośniki stoją w jednym rzędzie i zawijają się do kolejnych wierszy, gdy zabraknie szerokości; kolejność nigdy się nie przestawia, bo służy za spis pomocniczy.",
        "notaPrawna": "Nota prawna zostaje pod kreską także po zawinięciu odnośników — jest ostatnią treścią dokumentu i nie wchodzi w rząd odnośników.",
        "pozycjaNaStronie": "Stopka nie przykleja się do dołu okna: przy krótkiej treści oddziela ją od niej odstęp sekcji układu strony, a nie sztucznie zawyżona własna wysokość."
      },
      "a11y": {
        "rola": "contentinfo; odnośniki pomocnicze w liście wewnątrz nav z etykietą „Nawigacja pomocnicza”.",
        "klawiatura": "Odnośniki są ostatnimi przystankami Tab na stronie; kolejność skupienia zgadza się z kolejnością czytania, więc skrót do końca strony trafia w nie od razu.",
        "czytnikEkranu": "Punkt orientacyjny contentinfo pozwala skoczyć do stopki jednym poleceniem; kreska jest czysto wizualna i nie ma odpowiednika w drzewie dostępności."
      },
      "tokenConsumption": [
        "rdzen.semantic.tlo-wyciszone",
        "rdzen.semantic.tlo-odwrocone",
        "rdzen.semantic.obwodka-subtelna",
        "rdzen.semantic.obwodka-wyrazna",
        "rdzen.semantic.obwodka-skupienie",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.rozmiar.obwodka-srednia",
        "rdzen.rozmiar.promien-maly",
        "rdzen.semantic.odstep-zwykly",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.semantic.tekst-link",
        "rdzen.semantic.tekst-odwrocony",
        "rdzen.semantic.tekst-drugorzedny",
        "rdzen.semantic.akcja-podstawowa-najechanie",
        "rdzen.semantic.typografia-podpis",
        "rdzen.typografia.rozmiar-drobny",
        "rdzen.typografia.wysokosc-zwykla",
        "rdzen.typografia.rodzina-podstawowa",
        "rdzen.krycie.mocne"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "stack",
          "children": [
            "linki",
            "kreska",
            "nota"
          ],
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        },
        {
          "id": "linki",
          "element": "row",
          "children": [
            "link-pomoc",
            "link-kontakt",
            "link-prywatnosci"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-zwykly"
            }
          }
        },
        {
          "id": "link-pomoc",
          "element": "text",
          "textFrom": "props.linkPomoc.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-link"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            }
          }
        },
        {
          "id": "link-kontakt",
          "element": "text",
          "textFrom": "props.linkKontakt.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-link"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            }
          }
        },
        {
          "id": "link-prywatnosci",
          "element": "text",
          "textFrom": "props.linkPrywatnosci.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-link"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            }
          }
        },
        {
          "id": "kreska",
          "element": "spacer",
          "bind": {
            "height": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "background": {
              "token": "rdzen.semantic.obwodka-subtelna"
            }
          }
        },
        {
          "id": "nota",
          "element": "text",
          "textFrom": "props.notaPrawna.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "fontSize": {
              "token": "rdzen.typografia.rozmiar-drobny"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwykla"
            }
          }
        }
      ],
      "variants": {
        "ton": {
          "odwrocony": {
            "root": {
              "background": {
                "token": "rdzen.semantic.tlo-odwrocone"
              },
              "borderColor": {
                "token": "rdzen.semantic.obwodka-wyrazna"
              }
            },
            "link-pomoc": {
              "color": {
                "token": "rdzen.semantic.tekst-odwrocony"
              }
            },
            "link-kontakt": {
              "color": {
                "token": "rdzen.semantic.tekst-odwrocony"
              }
            },
            "link-prywatnosci": {
              "color": {
                "token": "rdzen.semantic.tekst-odwrocony"
              }
            },
            "kreska": {
              "background": {
                "token": "rdzen.semantic.obwodka-wyrazna"
              }
            },
            "nota": {
              "color": {
                "token": "rdzen.semantic.tekst-odwrocony"
              },
              "opacity": {
                "token": "rdzen.krycie.mocne"
              }
            }
          }
        }
      },
      "states": {
        "najechanie": {
          "link-pomoc": {
            "color": {
              "token": "rdzen.semantic.akcja-podstawowa-najechanie"
            }
          },
          "link-kontakt": {
            "color": {
              "token": "rdzen.semantic.akcja-podstawowa-najechanie"
            }
          },
          "link-prywatnosci": {
            "color": {
              "token": "rdzen.semantic.akcja-podstawowa-najechanie"
            }
          }
        },
        "skupienie": {
          "link-pomoc": {
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            },
            "radius": {
              "token": "rdzen.rozmiar.promien-maly"
            }
          },
          "link-kontakt": {
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            },
            "radius": {
              "token": "rdzen.rozmiar.promien-maly"
            }
          },
          "link-prywatnosci": {
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            },
            "radius": {
              "token": "rdzen.rozmiar.promien-maly"
            }
          }
        }
      }
    }
  },
  "powiadomienie": {
    "osie": {
      "ton": [
        "informacja",
        "sukces",
        "ostrzezenie",
        "blad"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "ton",
          "type": "enum",
          "enum": [
            "informacja",
            "sukces",
            "ostrzezenie",
            "blad"
          ],
          "required": true,
          "default": "informacja",
          "description": "Znaczenie komunikatu; steruje tłem, barwą ikony oraz natarczywością ogłoszenia dla czytnika ekranu."
        },
        {
          "name": "tytul",
          "type": "string",
          "required": true,
          "default": "Nowa wersja dokumentu",
          "description": "Pierwsze zdanie komunikatu, zrozumiałe samo w sobie, bez czytania opisu; próbka renderu bierze wartość domyślną."
        },
        {
          "name": "opis",
          "type": "string",
          "required": false,
          "default": "Odśwież widok, aby zobaczyć zmiany.",
          "description": "Uzupełnienie tytułu o następny krok użytkownika; pomijane, gdy tytuł wyczerpuje treść."
        },
        {
          "name": "czasZycia",
          "type": "number",
          "required": false,
          "default": 6000,
          "description": "Czas w milisekundach do samoczynnego zamknięcia; zero utrzymuje komunikat aż do zamknięcia ręcznego."
        },
        {
          "name": "zamykalne",
          "type": "boolean",
          "required": false,
          "default": true,
          "description": "Dodaje krzyżyk po prawej stronie treści. Przy tonie blad wartość false jest pomijana — komunikat, który nie znika samoczynnie, musi dać się zamknąć ręcznie."
        }
      ],
      "states": {
        "spoczynek": "Komunikat w pełnym kryciu, na tle właściwym dla tonu; licznik czasZycia biegnie.",
        "wygaszanie": "Ostatnia faza przed usunięciem z widoku: krycie schodzi do ledwie widocznego, a wysokość pozostaje bez zmian, żeby sąsiednie komunikaty w stosie nie podskoczyły."
      },
      "behavior": {
        "kolejkowanie": "Komunikaty układają się w stos w rogu ekranu, najnowszy wchodzi od dołu; jednocześnie widoczne są najwyżej trzy, kolejne czekają na zwolnienie miejsca.",
        "wstrzymanieOdliczania": "Najechanie kursorem albo wejście skupienia do wnętrza komunikatu zatrzymuje licznik czasZycia; po opuszczeniu licznik rusza od początku, a nie od reszty czasu.",
        "tonBledu": "Komunikat o tonie blad nie znika samoczynnie niezależnie od czasZycia — użytkownik musi go zobaczyć i zamknąć.",
        "zamkniecie": "Krzyżyk usuwa komunikat po zakończeniu wygaszania; skupienie wraca do elementu, który wywołał operację, a nie na początek strony.",
        "powtorzenia": "Identyczna treść zgłoszona ponownie odświeża licznik istniejącego komunikatu zamiast dokładać drugi taki sam; przy tonie blad, gdzie licznik nie biegnie, powtórzenie jest pomijane bez zmiany widoku."
      },
      "a11y": {
        "rola": "status dla tonów informacja i sukces, alert dla tonów ostrzezenie i blad; alert przerywa bieżący odczyt, status czeka na przerwę w mowie.",
        "klawiatura": "Komunikat nie przechwytuje skupienia i nie przerywa pisania; Tab dosięga krzyżyka, Escape zamyka komunikat, gdy skupienie jest w jego wnętrzu.",
        "czytnikEkranu": "Treść ogłaszana raz, w chwili pojawienia się: aria-live polite dla informacji i sukcesu, assertive dla ostrzeżenia i błędu. Ikona ma aria-hidden, bo powiela znaczenie tonu.",
        "znaczenieBezKoloru": "Ton musi wynikać ze słów tytułu, nie tylko z barwy tła; sam kolor nie niesie informacji dla osób nierozróżniających barw.",
        "etykietaZamkniecia": "Krzyżyk ma aria-label „Zamknij komunikat”, bo ikona bez tekstu nic nie mówi czytnikowi ekranu."
      },
      "tokenConsumption": [
        "rdzen.komponent.powiadomienie-tlo",
        "rdzen.komponent.powiadomienie-tresc",
        "rdzen.semantic.odstep-zwykly",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.rozmiar.odstep-025",
        "rdzen.semantic.promien-powierzchnia",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.semantic.obwodka-subtelna",
        "rdzen.semantic.stan-informacja-tresc",
        "rdzen.rozmiar.ikona-sredni",
        "rdzen.rozmiar.ikona-maly",
        "rdzen.semantic.typografia-tresc",
        "rdzen.typografia.grubosc-srednia",
        "rdzen.typografia.wysokosc-ciasna",
        "rdzen.semantic.tekst-drugorzedny",
        "rdzen.semantic.typografia-podpis",
        "rdzen.typografia.wysokosc-zwykla",
        "rdzen.semantic.stan-sukces-tlo",
        "rdzen.semantic.stan-sukces-tresc",
        "rdzen.semantic.stan-ostrzezenie-tlo",
        "rdzen.semantic.stan-ostrzezenie-tresc",
        "rdzen.semantic.stan-blad-tlo",
        "rdzen.semantic.stan-blad-tresc",
        "rdzen.krycie.ledwie"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "row",
          "children": [
            "ikona",
            "tresc",
            "zamkniecie"
          ],
          "bind": {
            "background": {
              "token": "rdzen.komponent.powiadomienie-tlo"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "radius": {
              "token": "rdzen.semantic.promien-powierzchnia"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            }
          }
        },
        {
          "id": "ikona",
          "element": "icon",
          "iconName": "informacja",
          "bind": {
            "color": {
              "token": "rdzen.semantic.stan-informacja-tresc"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-sredni"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-sredni"
            }
          }
        },
        {
          "id": "tresc",
          "element": "stack",
          "children": [
            "tytul",
            "opis"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.rozmiar.odstep-025"
            }
          }
        },
        {
          "id": "tytul",
          "element": "text",
          "textFrom": "props.tytul.default",
          "bind": {
            "color": {
              "token": "rdzen.komponent.powiadomienie-tresc"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            }
          }
        },
        {
          "id": "opis",
          "element": "text",
          "textFrom": "props.opis.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwykla"
            }
          }
        },
        {
          "id": "zamkniecie",
          "element": "icon",
          "iconName": "krzyzyk",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-maly"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-maly"
            }
          }
        }
      ],
      "variants": {
        "ton": {
          "sukces": {
            "root": {
              "background": {
                "token": "rdzen.semantic.stan-sukces-tlo"
              }
            },
            "ikona": {
              "color": {
                "token": "rdzen.semantic.stan-sukces-tresc"
              }
            },
            "tytul": {
              "color": {
                "token": "rdzen.semantic.stan-sukces-tresc"
              }
            }
          },
          "ostrzezenie": {
            "root": {
              "background": {
                "token": "rdzen.semantic.stan-ostrzezenie-tlo"
              }
            },
            "ikona": {
              "color": {
                "token": "rdzen.semantic.stan-ostrzezenie-tresc"
              }
            },
            "tytul": {
              "color": {
                "token": "rdzen.semantic.stan-ostrzezenie-tresc"
              }
            }
          },
          "blad": {
            "root": {
              "background": {
                "token": "rdzen.semantic.stan-blad-tlo"
              }
            },
            "ikona": {
              "color": {
                "token": "rdzen.semantic.stan-blad-tresc"
              }
            },
            "tytul": {
              "color": {
                "token": "rdzen.semantic.stan-blad-tresc"
              }
            }
          }
        }
      },
      "states": {
        "wygaszanie": {
          "root": {
            "opacity": {
              "token": "rdzen.krycie.ledwie"
            }
          }
        }
      }
    }
  },
  "pasek-postepu": {
    "osie": {
      "stan": [
        "w-toku",
        "ukonczony"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "stan",
          "type": "enum",
          "enum": [
            "w-toku",
            "ukonczony"
          ],
          "required": true,
          "default": "w-toku",
          "description": "Faza operacji; ukonczony przestawia oba odcinki toru na barwę sukcesu i zamienia podpis w komunikat o zakończeniu."
        },
        {
          "name": "wartosc",
          "type": "number",
          "required": true,
          "default": 60,
          "description": "Postęp w procentach od zera do stu; próbka renderu odwzorowuje sześćdziesiąt procent podziałem toru w stosunku sześć do czterech."
        },
        {
          "name": "etykieta",
          "type": "string",
          "required": false,
          "default": "Wysyłanie 60%",
          "description": "Podpis pod torem łączący nazwę operacji z odczytem procentowym; bez niego pasek nie mówi, na co użytkownik czeka."
        },
        {
          "name": "pokazEtykiete",
          "type": "boolean",
          "required": false,
          "default": true,
          "description": "Ukrycie podpisu dopuszczalne tylko wtedy, gdy nazwa operacji stoi tuż obok paska w innym elemencie."
        }
      ],
      "states": {
        "w-toku": "Tor podzielony proporcjonalnie do wartosc: wypełnienie w barwie akcji podstawowej, pozostałość w tle wyciszonym. Wypełnienie rośnie skokami przy każdej aktualizacji i nigdy nie cofa się samo.",
        "ukonczony": "Wartość doszła do stu: oba odcinki toru przyjmują barwę treści sukcesu, więc tor czyta się jako pełny na całej długości, a podpis zamienia się w komunikat o zakończeniu. Po dwóch sekundach pasek razem z podpisem znika z widoku."
      },
      "behavior": {
        "aktualizacja": "Zmiana wartosc przesuwa krawędź wypełnienia płynnie, w czasie krótszym niż jedna piąta sekundy; kolejne zgłoszenia w trakcie przejścia nadpisują cel, a nie kolejkują się.",
        "zakres": "Wartości poniżej zera i powyżej stu są przycinane; przycięcie do stu nie przełącza samo stanu na ukonczony — o tym decyduje zamknięcie operacji.",
        "zaokraglenie": "Odczyt procentowy w podpisie zaokrąglany w dół, żeby sto procent nie pojawiło się, zanim operacja faktycznie się skończy.",
        "brakWartosci": "Pasek nie ma trybu nieokreślonego — dla operacji o nieznanym czasie trwania właściwy jest wskaźnik ładowania."
      },
      "a11y": {
        "rola": "progressbar z aria-valuemin równym zero, aria-valuemax równym sto i aria-valuenow równym wartosc.",
        "klawiatura": "Element nie przyjmuje skupienia i jest pomijany przez Tab, bo niczym nie da się w nim sterować — to odczyt, nie kontrolka.",
        "czytnikEkranu": "Nazwa brana z aria-labelledby wskazującego podpis; zmiany ogłaszane najwyżej raz na pięć sekund, żeby aktualizacje co kilka procent nie zagłuszyły reszty strony.",
        "ruch": "Przy systemowym ograniczeniu ruchu wypełnienie zmienia długość natychmiast, bez przejścia.",
        "kontrast": "Wypełnienie i pozostałość mają wobec siebie kontrast co najmniej 3:1, więc podział toru pozostaje czytelny także po wydruku w odcieniach szarości."
      },
      "tokenConsumption": [
        "rdzen.rozmiar.odstep-050",
        "rdzen.rozmiar.odstep-000",
        "rdzen.semantic.promien-pelny",
        "rdzen.semantic.tlo-wyciszone",
        "rdzen.rozmiar.odstep-600",
        "rdzen.rozmiar.odstep-075",
        "rdzen.semantic.akcja-podstawowa",
        "rdzen.rozmiar.odstep-400",
        "rdzen.semantic.tekst-drugorzedny",
        "rdzen.semantic.typografia-podpis",
        "rdzen.typografia.wysokosc-ciasna",
        "rdzen.semantic.stan-sukces-tresc"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "stack",
          "children": [
            "tor",
            "etykieta"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.rozmiar.odstep-050"
            }
          }
        },
        {
          "id": "tor",
          "element": "row",
          "children": [
            "wypelnienie",
            "pozostalosc"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.rozmiar.odstep-000"
            },
            "radius": {
              "token": "rdzen.semantic.promien-pelny"
            },
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            }
          }
        },
        {
          "id": "wypelnienie",
          "element": "spacer",
          "bind": {
            "width": {
              "token": "rdzen.rozmiar.odstep-600"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-075"
            },
            "background": {
              "token": "rdzen.semantic.akcja-podstawowa"
            },
            "radius": {
              "token": "rdzen.semantic.promien-pelny"
            }
          }
        },
        {
          "id": "pozostalosc",
          "element": "spacer",
          "bind": {
            "width": {
              "token": "rdzen.rozmiar.odstep-400"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-075"
            },
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            },
            "radius": {
              "token": "rdzen.semantic.promien-pelny"
            }
          }
        },
        {
          "id": "etykieta",
          "element": "text",
          "textFrom": "props.etykieta.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            }
          }
        }
      ],
      "variants": {
        "stan": {
          "ukonczony": {
            "wypelnienie": {
              "background": {
                "token": "rdzen.semantic.stan-sukces-tresc"
              }
            },
            "pozostalosc": {
              "background": {
                "token": "rdzen.semantic.stan-sukces-tresc"
              }
            },
            "etykieta": {
              "color": {
                "token": "rdzen.semantic.stan-sukces-tresc"
              }
            }
          }
        }
      }
    }
  },
  "wskaznik-ladowania": {
    "osie": {
      "rozmiar": [
        "maly",
        "sredni",
        "duzy"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "rozmiar",
          "type": "enum",
          "enum": [
            "maly",
            "sredni",
            "duzy"
          ],
          "required": false,
          "default": "sredni",
          "description": "Średnica kropek i wielkość podpisu; maly mieści się w przycisku obok jego etykiety, duzy obsługuje wczytywanie całego widoku."
        },
        {
          "name": "komunikat",
          "type": "string",
          "required": false,
          "default": "Wczytywanie danych…",
          "description": "Tekst obok kropek nazywający operację, na którą użytkownik czeka; próbka renderu bierze wartość domyślną."
        },
        {
          "name": "opoznienie",
          "type": "number",
          "required": false,
          "default": 400,
          "description": "Czas w milisekundach, przez który wskaźnik pozostaje niewidoczny po starcie operacji; krótkie żądania kończą się, zanim cokolwiek mignie."
        },
        {
          "name": "pelnyEkran",
          "type": "boolean",
          "required": false,
          "default": false,
          "description": "Ustawia wskaźnik na środku obszaru rodzica i blokuje klikanie w treść pod spodem na czas operacji."
        }
      ],
      "states": {
        "ladowanie": "Trzy kropki rozjaśniają się i gasną kolejno od lewej do prawej; pełny cykl trwa około dziewięciuset milisekund i powtarza się bez końca, dopóki operacja nie wróci.",
        "ruch-ograniczony": "Przy systemowym ograniczeniu ruchu kropki przestają pulsować i przyjmują jednakowe krycie; oczekiwanie niesie wtedy sam podpis. Odczyt dla czytnika ekranu pozostaje ten sam co przy pulsowaniu, bo animacja i tak nigdy do niego nie docierała."
      },
      "behavior": {
        "opoznieniePojawienia": "Wskaźnik nie rysuje się przed upływem opoznienie — żądania szybsze niż ten próg nie powodują błysku na ekranie.",
        "minimalnyCzas": "Gdy wskaźnik zdążył się już pokazać, zostaje widoczny co najmniej pięćset milisekund, nawet jeśli odpowiedź przyszła wcześniej; inaczej znikałby w połowie mrugnięcia.",
        "brakPostepu": "Wskaźnik nie przyjmuje wartości procentowej ani szacowanego czasu — dla operacji o znanym czasie trwania właściwy jest pasek postępu.",
        "zakonczenie": "Po powrocie odpowiedzi wskaźnik ustępuje miejsca treści albo komunikatowi o błędzie; nie wolno zostawić po nim pustego obszaru.",
        "zagniezdzenie": "W jednym obszarze pokazuje się najwyżej jeden wskaźnik — kilka równoległych żądań czeka pod wspólnym."
      },
      "a11y": {
        "rola": "status; obszar, który się wczytuje, nosi aria-busy true przez cały czas trwania operacji.",
        "klawiatura": "Wskaźnik nie przyjmuje skupienia i Tab go omija; przy pelnyEkran skupienie jest utrzymane poza zasłoniętą treścią, żeby nie wędrowało po elementach, w które nie da się kliknąć.",
        "czytnikEkranu": "Podpis odczytywany przez aria-live polite w chwili pojawienia się wskaźnika; kropki mają aria-hidden, bo nic nie wnoszą do odczytu.",
        "ruch": "Pulsowanie wyłączane przez prefers-reduced-motion; wtedy jedynym nośnikiem informacji o oczekiwaniu jest tekst komunikatu.",
        "komunikatObowiazkowy": "Komunikat nie może brzmieć „Proszę czekać” — ma nazywać operację, bo czytnik ekranu nie widzi kontekstu, w którym wskaźnik stoi."
      },
      "tokenConsumption": [
        "rdzen.semantic.odstep-ciasny",
        "rdzen.rozmiar.odstep-025",
        "rdzen.rozmiar.odstep-050",
        "rdzen.rozmiar.odstep-100",
        "rdzen.semantic.promien-pelny",
        "rdzen.semantic.akcja-podstawowa",
        "rdzen.krycie.pelne",
        "rdzen.krycie.mocne",
        "rdzen.krycie.polowa",
        "rdzen.semantic.tekst-drugorzedny",
        "rdzen.semantic.typografia-podpis",
        "rdzen.typografia.wysokosc-ciasna",
        "rdzen.rozmiar.odstep-075",
        "rdzen.typografia.rozmiar-drobny",
        "rdzen.semantic.odstep-przylegly",
        "rdzen.rozmiar.odstep-150",
        "rdzen.semantic.typografia-tresc",
        "rdzen.semantic.odstep-zwykly"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "row",
          "children": [
            "kropki",
            "podpis"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "paddingY": {
              "token": "rdzen.rozmiar.odstep-025"
            }
          }
        },
        {
          "id": "kropki",
          "element": "row",
          "children": [
            "kropka-1",
            "kropka-2",
            "kropka-3"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.rozmiar.odstep-050"
            }
          }
        },
        {
          "id": "kropka-1",
          "element": "spacer",
          "bind": {
            "width": {
              "token": "rdzen.rozmiar.odstep-100"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-100"
            },
            "radius": {
              "token": "rdzen.semantic.promien-pelny"
            },
            "background": {
              "token": "rdzen.semantic.akcja-podstawowa"
            },
            "opacity": {
              "token": "rdzen.krycie.pelne"
            }
          }
        },
        {
          "id": "kropka-2",
          "element": "spacer",
          "bind": {
            "width": {
              "token": "rdzen.rozmiar.odstep-100"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-100"
            },
            "radius": {
              "token": "rdzen.semantic.promien-pelny"
            },
            "background": {
              "token": "rdzen.semantic.akcja-podstawowa"
            },
            "opacity": {
              "token": "rdzen.krycie.mocne"
            }
          }
        },
        {
          "id": "kropka-3",
          "element": "spacer",
          "bind": {
            "width": {
              "token": "rdzen.rozmiar.odstep-100"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-100"
            },
            "radius": {
              "token": "rdzen.semantic.promien-pelny"
            },
            "background": {
              "token": "rdzen.semantic.akcja-podstawowa"
            },
            "opacity": {
              "token": "rdzen.krycie.polowa"
            }
          }
        },
        {
          "id": "podpis",
          "element": "text",
          "textFrom": "props.komunikat.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            }
          }
        }
      ],
      "variants": {
        "rozmiar": {
          "maly": {
            "root": {
              "gap": {
                "token": "rdzen.semantic.odstep-przylegly"
              }
            },
            "kropka-1": {
              "width": {
                "token": "rdzen.rozmiar.odstep-075"
              },
              "height": {
                "token": "rdzen.rozmiar.odstep-075"
              }
            },
            "kropka-2": {
              "width": {
                "token": "rdzen.rozmiar.odstep-075"
              },
              "height": {
                "token": "rdzen.rozmiar.odstep-075"
              }
            },
            "kropka-3": {
              "width": {
                "token": "rdzen.rozmiar.odstep-075"
              },
              "height": {
                "token": "rdzen.rozmiar.odstep-075"
              }
            },
            "podpis": {
              "fontSize": {
                "token": "rdzen.typografia.rozmiar-drobny"
              }
            }
          },
          "duzy": {
            "root": {
              "gap": {
                "token": "rdzen.semantic.odstep-zwykly"
              }
            },
            "kropka-1": {
              "width": {
                "token": "rdzen.rozmiar.odstep-150"
              },
              "height": {
                "token": "rdzen.rozmiar.odstep-150"
              }
            },
            "kropka-2": {
              "width": {
                "token": "rdzen.rozmiar.odstep-150"
              },
              "height": {
                "token": "rdzen.rozmiar.odstep-150"
              }
            },
            "kropka-3": {
              "width": {
                "token": "rdzen.rozmiar.odstep-150"
              },
              "height": {
                "token": "rdzen.rozmiar.odstep-150"
              }
            },
            "podpis": {
              "fontSize": {
                "token": "rdzen.semantic.typografia-tresc"
              }
            }
          }
        }
      },
      "states": {
        "ruch-ograniczony": {
          "kropka-1": {
            "opacity": {
              "token": "rdzen.krycie.mocne"
            }
          },
          "kropka-2": {
            "opacity": {
              "token": "rdzen.krycie.mocne"
            }
          },
          "kropka-3": {
            "opacity": {
              "token": "rdzen.krycie.mocne"
            }
          }
        }
      }
    }
  },
  "zakladki": {
    "osie": {
      "uklad": [
        "poziomy",
        "pionowy"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "uklad",
          "type": "enum",
          "enum": [
            "poziomy",
            "pionowy"
          ],
          "required": true,
          "default": "poziomy",
          "description": "Kierunek listy zakładek. W układzie pionowym lista stoi w kolumnie po lewej stronie panelu, a wskaźnik aktywnej pozycji przenosi się z dołu etykiety na jej lewą krawędź; opłaca się przy więcej niż sześciu pozycjach lub długich etykietach."
        },
        {
          "name": "pozycje",
          "type": "array",
          "required": true,
          "default": [
            {
              "id": "przeglad",
              "etykieta": "Przegląd",
              "panel": "panel-przeglad"
            },
            {
              "id": "zespol",
              "etykieta": "Zespół",
              "panel": "panel-zespol"
            },
            {
              "id": "pliki",
              "etykieta": "Pliki",
              "panel": "panel-pliki"
            }
          ],
          "description": "Lista zakładek jako trójki: identyfikator zakładki, etykieta i identyfikator powiązanego panelu; kolejność w tablicy jest kolejnością przechodzenia strzałkami."
        },
        {
          "name": "wybrana",
          "type": "string",
          "required": true,
          "default": "przeglad",
          "description": "Identyfikator zakładki, której panel jest widoczny; wartość spoza pozycje cofa wybór na pierwszą zakładkę."
        },
        {
          "name": "etykietaAktywnej",
          "type": "string",
          "required": false,
          "default": "Przegląd",
          "description": "Etykieta zakładki wskazanej przez wybrana; w działaniu pochodzi z pozycje, w próbce renderu podana wprost."
        },
        {
          "name": "etykietaDruga",
          "type": "string",
          "required": false,
          "default": "Zespół",
          "description": "Etykieta drugiej pozycji listy; w działaniu pochodzi z pozycje, w próbce renderu podana wprost i to na niej pokazywane są stany najechania i skupienia."
        },
        {
          "name": "etykietaTrzecia",
          "type": "string",
          "required": false,
          "default": "Pliki",
          "description": "Etykieta trzeciej pozycji listy; w działaniu pochodzi z pozycje, w próbce renderu podana wprost."
        }
      ],
      "states": {
        "aktywna": "Zakładka powiązana z widocznym panelem: etykieta w barwie pozycji aktywnej i grubości średniej, pod nią wskaźnik o grubości obwódki grubej. W jednej grupie jest dokładnie jedna taka zakładka.",
        "nieaktywna": "Etykieta w barwie zwykłej pozycji nawigacji, bez wskaźnika; jej panel jest usunięty z drzewa dokumentu, a nie tylko ukryty — dlatego pola formularza w nieaktywnym panelu nie trafiają do wysyłki.",
        "najechanie": "Kursor nad etykietą zakładki nieaktywnej podnosi jej barwę do tekstu podstawowego. Wskaźnik się nie pojawia, żeby najechanie nie wyglądało jak dokonane przełączenie.",
        "skupienie": "Zakładka wskazana klawiaturą dostaje obwódkę skupienia wokół pola etykiety, poza jej obrysem, więc sąsiednie zakładki nie przesuwają się. Przy aktywacji ręcznej panel zmienia się dopiero po Enter lub spacji."
      },
      "behavior": {
        "przelaczanie": "Strzałki lewo i prawo — w układzie pionowym góra i dół — przesuwają wskazanie po zakładkach, zawijając z ostatniej na pierwszą.",
        "aktywacja": "Domyślnie automatyczna: przesunięcie wskazania od razu wymienia panel. Gdy panel wymaga pobrania danych z sieci, przełącz na aktywację ręczną, żeby przejście strzałkami przez listę nie wystrzeliło kilku żądań.",
        "nadmiarPozycji": "Gdy w układzie poziomym etykiety nie mieszczą się w szerokości, pasek przewija się w poziomie i przy krawędziach pojawia się cieniowanie; zakładki nigdy nie zawijają się do drugiego wiersza, bo złamałoby to porządek przechodzenia strzałkami. Przy stale przepełnionym pasku właściwszy jest układ pionowy.",
        "pamiecWyboru": "Identyfikator wybranej zakładki trafia do adresu strony, więc odświeżenie i udostępniony odnośnik otwierają ten sam panel.",
        "panelZeSkupieniem": "Panel przyjmuje skupienie jako całość (tabindex zero) tylko wtedy, gdy nie zawiera własnych elementów interaktywnych — inaczej Tab z zakładki wchodzi wprost w jego pierwszą kontrolkę."
      },
      "a11y": {
        "rola": "tablist na pasku zakładek, tab na każdej zakładce, tabpanel na treści; powiązanie w obie strony przez aria-controls i aria-labelledby.",
        "klawiatura": "Tab wchodzi na zakładkę aktywną i wychodzi do panelu, a nie na następną zakładkę; strzałki przesuwają wskazanie, Home i End skaczą na pierwszą i ostatnią pozycję.",
        "czytnikEkranu": "Zakładka aktywna ma aria-selected true, pozostałe false; położenie w grupie podawane przez aria-posinset i aria-setsize, żeby odczyt mówił „druga z trzech”.",
        "skupienieWedrujace": "Tylko zakładka aktywna ma tabindex zero, pozostałe minus jeden — dzięki temu Tab nie każe przechodzić przez całą listę, by dotrzeć do treści.",
        "wskaznikNieTylkoKolor": "Aktywną zakładkę odróżnia wskaźnik i grubość pisma, nie sama barwa etykiety."
      },
      "tokenConsumption": [
        "rdzen.semantic.odstep-zwykly",
        "rdzen.rozmiar.odstep-025",
        "rdzen.rozmiar.odstep-050",
        "rdzen.funkcjonalne.nawigacja-pozycja-aktywna",
        "rdzen.semantic.typografia-tresc",
        "rdzen.typografia.grubosc-srednia",
        "rdzen.typografia.wysokosc-ciasna",
        "rdzen.rozmiar.obwodka-gruba",
        "rdzen.rozmiar.odstep-500",
        "rdzen.semantic.akcja-podstawowa",
        "rdzen.semantic.promien-pelny",
        "rdzen.funkcjonalne.nawigacja-pozycja-tekst",
        "rdzen.typografia.grubosc-zwykla",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.rozmiar.odstep-200",
        "rdzen.semantic.tekst-podstawowy",
        "rdzen.semantic.obwodka-skupienie",
        "rdzen.rozmiar.obwodka-srednia",
        "rdzen.semantic.promien-interakcja"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "row",
          "children": [
            "z-aktywna",
            "z-druga",
            "z-trzecia"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.rozmiar.odstep-025"
            }
          }
        },
        {
          "id": "z-aktywna",
          "element": "stack",
          "children": [
            "z-aktywna-tekst",
            "z-aktywna-wskaznik"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.rozmiar.odstep-050"
            },
            "paddingX": {
              "token": "rdzen.rozmiar.odstep-025"
            }
          }
        },
        {
          "id": "z-aktywna-tekst",
          "element": "text",
          "textFrom": "props.etykietaAktywnej.default",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.nawigacja-pozycja-aktywna"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            }
          }
        },
        {
          "id": "z-aktywna-wskaznik",
          "element": "spacer",
          "bind": {
            "height": {
              "token": "rdzen.rozmiar.obwodka-gruba"
            },
            "width": {
              "token": "rdzen.rozmiar.odstep-500"
            },
            "background": {
              "token": "rdzen.semantic.akcja-podstawowa"
            },
            "radius": {
              "token": "rdzen.semantic.promien-pelny"
            }
          }
        },
        {
          "id": "z-druga",
          "element": "stack",
          "children": [
            "z-druga-tekst"
          ],
          "bind": {
            "paddingX": {
              "token": "rdzen.rozmiar.odstep-025"
            }
          }
        },
        {
          "id": "z-druga-tekst",
          "element": "text",
          "textFrom": "props.etykietaDruga.default",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.nawigacja-pozycja-tekst"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-zwykla"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            }
          }
        },
        {
          "id": "z-trzecia",
          "element": "stack",
          "children": [
            "z-trzecia-tekst"
          ],
          "bind": {
            "paddingX": {
              "token": "rdzen.rozmiar.odstep-025"
            }
          }
        },
        {
          "id": "z-trzecia-tekst",
          "element": "text",
          "textFrom": "props.etykietaTrzecia.default",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.nawigacja-pozycja-tekst"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-zwykla"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            }
          }
        }
      ],
      "variants": {
        "uklad": {
          "pionowy": {
            "root": {
              "gap": {
                "token": "rdzen.semantic.odstep-ciasny"
              }
            },
            "z-aktywna-wskaznik": {
              "width": {
                "token": "rdzen.rozmiar.obwodka-gruba"
              },
              "height": {
                "token": "rdzen.rozmiar.odstep-200"
              }
            }
          }
        }
      },
      "states": {
        "najechanie": {
          "z-druga-tekst": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            }
          }
        },
        "skupienie": {
          "z-druga": {
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            }
          }
        }
      }
    }
  },
  "okruszki": {
    "osie": null,
    "kontrakt": {
      "props": [
        {
          "name": "korzen",
          "type": "string",
          "required": true,
          "default": "Start",
          "description": "Pierwsze ogniwo ścieżki, zawsze widoczne; próbka renderu wypisuje wartość domyślną."
        },
        {
          "name": "dzial",
          "type": "string",
          "required": false,
          "default": "Katalog",
          "description": "Ogniwo pośrednie; przy dłuższej ścieżce to właśnie te ogniwa zwijają się pod wielokropek."
        },
        {
          "name": "biezacy",
          "type": "string",
          "required": true,
          "default": "Pozycja 24",
          "description": "Ostatnie ogniwo, wskazujące stronę oglądaną; nie jest odnośnikiem i nie reaguje na kliknięcie."
        },
        {
          "name": "ogniwa",
          "type": "array",
          "required": false,
          "description": "Pełna ścieżka od korzenia do strony bieżącej, gdy ogniw jest więcej niż trzy; kolejność z listy jest kolejnością wyświetlania."
        },
        {
          "name": "skracanie",
          "type": "boolean",
          "required": false,
          "default": true,
          "description": "Zwija ogniwa środkowe pod wielokropek rozwijany kliknięciem, gdy ścieżka przekroczy cztery ogniwa albo nie mieści się w rzędzie; przy wyłączeniu ścieżka przewija się w poziomie."
        }
      ],
      "states": {
        "spoczynek": "Ogniwa odnośnikowe w kolorze odnośnika, ogniwo bieżące w kolorze pozycji aktywnej i mocniejszej grubości, separatory wyciszone.",
        "najechanie": "Kursor nad ogniwem odnośnikowym zmienia jego kolor na najechanie akcji podstawowej; ogniwo bieżące i separatory pozostają bez reakcji.",
        "skupienie": "Ogniwo odnośnikowe wskazane klawiaturą dostaje obwódkę skupienia z małym promieniem, rysowaną wokół samego tekstu, żeby nie rozpychać rzędu."
      },
      "behavior": {
        "ostatnieOgniwo": "Ogniwo bieżące jest tekstem, nie odnośnikiem — nie da się go kliknąć ani wskazać Tabem, bo prowadziłoby na stronę już otwartą.",
        "skracanie": "Chowane są wyłącznie ogniwa środkowe, gdy ścieżka ma więcej niż cztery ogniwa albo nie mieści się w szerokości rzędu; korzeń i ogniwo bieżące zostają widoczne zawsze, żeby początek i koniec ścieżki był czytelny.",
        "brakZawijania": "Ścieżka nie łamie się do drugiego wiersza; zamiast tego skraca ogniwa środkowe, dzięki czemu wysokość paska nagłówka jest stała.",
        "separator": "Separator jest wstawiany między ogniwa przez komponent, nie wpisywany w treść ogniwa — nie trafia więc do kopiowanego tekstu."
      },
      "a11y": {
        "rola": "nav z etykietą „Ścieżka nawigacyjna”, wewnątrz lista uporządkowana z ogniwami jako pozycjami.",
        "klawiatura": "Tab przechodzi po ogniwach odnośnikowych w kolejności ścieżki i pomija ogniwo bieżące; wielokropek skracania jest przystankiem, który rozwija ukryte ogniwa Enterem.",
        "czytnikEkranu": "Ogniwo bieżące oznaczone aria-current o wartości page; ikony separatorów są ukryte przez aria-hidden, więc czytnik nie wtrąca „strzałka” między nazwami."
      },
      "tokenConsumption": [
        "rdzen.funkcjonalne.nawigacja-tlo",
        "rdzen.funkcjonalne.nawigacja-separator",
        "rdzen.funkcjonalne.nawigacja-pozycja-aktywna",
        "rdzen.rozmiar.odstep-050",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.semantic.tekst-link",
        "rdzen.semantic.typografia-podpis",
        "rdzen.typografia.wysokosc-ciasna",
        "rdzen.typografia.grubosc-srednia",
        "rdzen.typografia.rodzina-podstawowa",
        "rdzen.rozmiar.ikona-maly",
        "rdzen.semantic.akcja-podstawowa-najechanie",
        "rdzen.semantic.obwodka-skupienie",
        "rdzen.rozmiar.obwodka-srednia",
        "rdzen.rozmiar.promien-maly"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "row",
          "children": [
            "ogniwo-korzen",
            "separator-pierwszy",
            "ogniwo-dzial",
            "separator-drugi",
            "ogniwo-biezace"
          ],
          "bind": {
            "background": {
              "token": "rdzen.funkcjonalne.nawigacja-tlo"
            },
            "gap": {
              "token": "rdzen.rozmiar.odstep-050"
            },
            "paddingY": {
              "token": "rdzen.rozmiar.odstep-050"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        },
        {
          "id": "ogniwo-korzen",
          "element": "text",
          "textFrom": "props.korzen.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-link"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            }
          }
        },
        {
          "id": "separator-pierwszy",
          "element": "icon",
          "iconName": "strzalka-prawo",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.nawigacja-separator"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-maly"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-maly"
            }
          }
        },
        {
          "id": "ogniwo-dzial",
          "element": "text",
          "textFrom": "props.dzial.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-link"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            }
          }
        },
        {
          "id": "separator-drugi",
          "element": "icon",
          "iconName": "strzalka-prawo",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.nawigacja-separator"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-maly"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-maly"
            }
          }
        },
        {
          "id": "ogniwo-biezace",
          "element": "text",
          "textFrom": "props.biezacy.default",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.nawigacja-pozycja-aktywna"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            }
          }
        }
      ],
      "states": {
        "najechanie": {
          "ogniwo-korzen": {
            "color": {
              "token": "rdzen.semantic.akcja-podstawowa-najechanie"
            }
          },
          "ogniwo-dzial": {
            "color": {
              "token": "rdzen.semantic.akcja-podstawowa-najechanie"
            }
          }
        },
        "skupienie": {
          "ogniwo-korzen": {
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            },
            "radius": {
              "token": "rdzen.rozmiar.promien-maly"
            }
          },
          "ogniwo-dzial": {
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            },
            "radius": {
              "token": "rdzen.rozmiar.promien-maly"
            }
          }
        }
      }
    }
  },
  "stronicowanie": {
    "osie": {
      "uklad": [
        "zwiezly",
        "pelny"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "uklad",
          "type": "enum",
          "enum": [
            "zwiezly",
            "pelny"
          ],
          "required": false,
          "default": "zwiezly",
          "description": "zwiezly — dwie strzałki i odczyt „numer łącznik liczba stron”; mieści się w pasku narzędzi i to jego pokazuje próbka renderu. pelny — dodatkowo przyciski z numerami sąsiednich stron oraz skoki na pierwszą i ostatnią, dlatego wariant zacieśnia odstęp między przyciskami i dopełnienie strzałek, żeby dłuższy rząd zmieścił się w tej samej szerokości."
        },
        {
          "name": "stronaBiezaca",
          "type": "number",
          "required": true,
          "default": 3,
          "description": "Numer wyświetlanej strony liczony od jedynki; próbka renderu bierze tę wartość jako treść wyróżnionego przycisku."
        },
        {
          "name": "liczbaStron",
          "type": "number",
          "required": true,
          "default": 12,
          "description": "Łączna liczba stron wyliczona z liczby elementów i rozmiarStrony; próbka renderu bierze tę wartość jako treść po łączniku."
        },
        {
          "name": "lacznik",
          "type": "string",
          "required": false,
          "default": "z",
          "description": "Słowo między numerem strony a liczbą stron; osobny prop, bo nie w każdym języku jest to jeden wyraz i nie zawsze stoi w tym samym miejscu."
        },
        {
          "name": "rozmiarStrony",
          "type": "number",
          "required": false,
          "default": 25,
          "description": "Liczba elementów na stronie; jej zmiana cofa widok na stronę pierwszą, żeby nie wylądować poza nowym zakresem."
        }
      ],
      "states": {
        "biezaca": "Przycisk odpowiadający stronaBiezaca ma tło akcji podstawowej i tekst odwrócony. Kliknięcie w niego nic nie robi, bo prowadziłoby do strony już pokazanej.",
        "najechanie": "Kursor nad strzałką albo nad numerem innym niż bieżący zamienia jej tło z powierzchni na wyciszone i wzmacnia obwódkę z subtelnej na wyraźną; wyróżniony numer nie zmienia wyglądu.",
        "skupienie": "Element wskazany klawiaturą dostaje obwódkę skupienia poza obrysem przycisku, więc rząd przycisków nie rozjeżdża się przy przechodzeniu Tabem.",
        "wylaczony": "Strzałka wstecz na stronie pierwszej i strzałka dalej na ostatniej: ikona w barwie tekstu wyłączonego, tło wyciszone, brak reakcji na kliknięcie i pominięcie przy przechodzeniu Tabem."
      },
      "behavior": {
        "zmianaStrony": "Kliknięcie wymienia zawartość listy i przewija widok do jej początku, a nie na sam szczyt dokumentu; nowy numer strony dopisuje się do adresu przez historię przeglądarki, więc przycisk wstecz w przeglądarce wraca do poprzedniej strony listy.",
        "zakres": "Numer spoza przedziału od jedynki do liczbaStron jest przycinany do najbliższej krawędzi; rozmiarStrony mniejszy od jedynki jest odrzucany bez zmiany widoku.",
        "czasOczekiwania": "Na czas pobierania nowej strony przyciski pozostają aktywne, a obszar listy pokazuje wskaźnik ładowania; kolejne kliknięcie w trakcie pobierania porzuca poprzednie żądanie zamiast dokładać drugie.",
        "jednaStrona": "Przy liczbaStron równym jeden komponent nie jest renderowany. Lista pusta pokazuje pusty stan, a nie stronicowanie z zerem stron."
      },
      "a11y": {
        "rola": "nav z aria-label „Stronicowanie”; strzałki i numery są przyciskami, bo wymieniają zawartość tej samej listy, a nie prowadzą pod osobny adres zasobu — numer strony trafia do adresu przez historię przeglądarki, bez przeładowania dokumentu.",
        "klawiatura": "Tab przechodzi kolejno po dostępnych przyciskach, Enter i spacja zmieniają stronę; strzałki wyłączone na krańcach zakresu są z tego przechodzenia wyjęte.",
        "czytnikEkranu": "Wyróżniony numer ma aria-current równe page; strzałki mają etykiety „Poprzednia strona” i „Następna strona”, bo sam grot nic nie mówi.",
        "ogloszenieZmiany": "Po wczytaniu nowej strony obszar listy ogłasza przez aria-live polite numer strony i liczbę pokazanych elementów, inaczej zmiana byłaby dla czytnika ekranu niewidoczna.",
        "obszarDotyku": "Pole dotykowe każdego przycisku ma co najmniej 44 na 44 piksele — rozciągane poza widoczną ramkę, bo sama ramka strzałki jest od tego niższa."
      },
      "tokenConsumption": [
        "rdzen.rozmiar.odstep-075",
        "rdzen.rozmiar.odstep-025",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.rozmiar.odstep-050",
        "rdzen.semantic.promien-interakcja",
        "rdzen.semantic.tlo-powierzchnia",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.semantic.obwodka-subtelna",
        "rdzen.semantic.tekst-podstawowy",
        "rdzen.rozmiar.ikona-maly",
        "rdzen.semantic.akcja-podstawowa",
        "rdzen.semantic.tekst-odwrocony",
        "rdzen.semantic.typografia-tresc",
        "rdzen.typografia.grubosc-srednia",
        "rdzen.typografia.wysokosc-ciasna",
        "rdzen.semantic.tekst-drugorzedny",
        "rdzen.semantic.typografia-podpis",
        "rdzen.semantic.tlo-wyciszone",
        "rdzen.semantic.obwodka-wyrazna",
        "rdzen.semantic.obwodka-skupienie",
        "rdzen.rozmiar.obwodka-srednia",
        "rdzen.semantic.tekst-wylaczony"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "row",
          "children": [
            "wstecz",
            "licznik",
            "dalej"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.rozmiar.odstep-075"
            },
            "paddingY": {
              "token": "rdzen.rozmiar.odstep-025"
            }
          }
        },
        {
          "id": "wstecz",
          "element": "box",
          "children": [
            "wstecz-ikona"
          ],
          "bind": {
            "paddingX": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "paddingY": {
              "token": "rdzen.rozmiar.odstep-050"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            },
            "background": {
              "token": "rdzen.semantic.tlo-powierzchnia"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            }
          }
        },
        {
          "id": "wstecz-ikona",
          "element": "icon",
          "iconName": "strzalka-lewo",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-maly"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-maly"
            }
          }
        },
        {
          "id": "licznik",
          "element": "row",
          "children": [
            "numer-biezacy",
            "lacznik-tekst",
            "liczba-stron"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.rozmiar.odstep-050"
            },
            "paddingX": {
              "token": "rdzen.rozmiar.odstep-025"
            }
          }
        },
        {
          "id": "numer-biezacy",
          "element": "box",
          "children": [
            "numer-tekst"
          ],
          "bind": {
            "background": {
              "token": "rdzen.semantic.akcja-podstawowa"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "paddingY": {
              "token": "rdzen.rozmiar.odstep-025"
            }
          }
        },
        {
          "id": "numer-tekst",
          "element": "text",
          "textFrom": "props.stronaBiezaca.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-odwrocony"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            }
          }
        },
        {
          "id": "lacznik-tekst",
          "element": "text",
          "textFrom": "props.lacznik.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            }
          }
        },
        {
          "id": "liczba-stron",
          "element": "text",
          "textFrom": "props.liczbaStron.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            }
          }
        },
        {
          "id": "dalej",
          "element": "box",
          "children": [
            "dalej-ikona"
          ],
          "bind": {
            "paddingX": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "paddingY": {
              "token": "rdzen.rozmiar.odstep-050"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            },
            "background": {
              "token": "rdzen.semantic.tlo-powierzchnia"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            }
          }
        },
        {
          "id": "dalej-ikona",
          "element": "icon",
          "iconName": "strzalka-prawo",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-maly"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-maly"
            }
          }
        }
      ],
      "variants": {
        "uklad": {
          "pelny": {
            "root": {
              "gap": {
                "token": "rdzen.rozmiar.odstep-050"
              }
            },
            "wstecz": {
              "paddingX": {
                "token": "rdzen.rozmiar.odstep-050"
              }
            },
            "dalej": {
              "paddingX": {
                "token": "rdzen.rozmiar.odstep-050"
              }
            }
          }
        }
      },
      "states": {
        "najechanie": {
          "dalej": {
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-wyrazna"
            }
          }
        },
        "skupienie": {
          "dalej": {
            "outlineColor": {
              "token": "rdzen.semantic.obwodka-skupienie"
            },
            "outlineWidth": {
              "token": "rdzen.rozmiar.obwodka-srednia"
            }
          }
        },
        "wylaczony": {
          "wstecz": {
            "background": {
              "token": "rdzen.semantic.tlo-wyciszone"
            }
          },
          "wstecz-ikona": {
            "color": {
              "token": "rdzen.semantic.tekst-wylaczony"
            }
          }
        }
      }
    }
  },
  "podpowiedz": {
    "osie": {
      "pozycja": [
        "gora",
        "dol"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "tresc",
          "type": "string",
          "required": true,
          "default": "Widoczne dla osób z rolą redaktora",
          "description": "Jedno zdanie wyjaśniające kotwicę; bez odnośników i bez formatowania, bo treści chmurki nie da się wskazać kursorem."
        },
        {
          "name": "pozycja",
          "type": "enum",
          "enum": [
            "gora",
            "dol"
          ],
          "required": false,
          "default": "gora",
          "description": "Strona kotwicy, po której pojawia się chmurka. Gdy w oknie brakuje miejsca, strona jest odwracana i ogonek przenosi się na przeciwną krawędź."
        },
        {
          "name": "opoznienie",
          "type": "number",
          "required": false,
          "default": 400,
          "description": "Zwłoka w milisekundach przed pokazaniem po najechaniu wskaźnikiem. Skupienie klawiaturą pomija zwłokę."
        },
        {
          "name": "idKotwicy",
          "type": "string",
          "required": true,
          "default": "pole-widocznosc",
          "description": "Identyfikator elementu, do którego chmurka jest przypięta i który wskazuje ją przez aria-describedby."
        }
      ],
      "states": {
        "widoczna": "Chmurka wyrysowana przy kotwicy: ogonek dotyka jej krawędzi, treść mieści się w jednej lub dwóch liniach.",
        "ukryta": "Stan spoczynkowy przed najechaniem i po zamknięciu — chmurka nie zajmuje miejsca w układzie i nie jest ogłaszana przez czytnik ekranu; w przepisie próbki brak jest przybliżony zerowym kryciem korzenia, bo słownik właściwości nie daje niczego, czym można wyjąć część z układu."
      },
      "behavior": {
        "wyzwalanie": "Najechanie wskaźnikiem z opóźnieniem 400 ms albo skupienie kotwicy klawiaturą — wtedy bez opóźnienia.",
        "zamykanie": "Wyjechanie wskaźnikiem poza kotwicę, utrata skupienia, Escape i przewinięcie strony ukrywają chmurkę natychmiast, bez zwłoki wyjścia.",
        "trescNieinteraktywna": "Chmurka nie przyjmuje wskaźnika ani skupienia; najechanie na nią nie przedłuża widoczności, więc nie wolno w niej umieszczać odnośników — do tego służy dymek.",
        "jednaNaRaz": "Pokazanie kolejnej chmurki zamyka poprzednią; w dokumencie nigdy nie ma dwóch widocznych naraz.",
        "dotyk": "Na ekranie dotykowym nie ma wyzwalacza najechania, więc ta sama treść musi być dostępna w opisie pola lub w tekście pomocniczym."
      },
      "a11y": {
        "rola": "tooltip; kotwica pozostaje jedynym elementem osiągalnym Tab-em.",
        "klawiatura": "Skupienie kotwicy pokazuje chmurkę, Escape ją zamyka bez zabierania skupienia; Tab przenosi dalej i zamyka po drodze.",
        "czytnikEkranu": "Kotwica wskazuje chmurkę przez aria-describedby, więc treść jest doczytywana po nazwie kotwicy i nie tworzy osobnego przystanku w kolejności czytania.",
        "powiekszenieTekstu": "Przy powiększeniu tekstu do 200% chmurka zawija treść i rośnie w pionie; szerokość jest ograniczona do szerokości kolumny treści, nic nie jest przycinane."
      },
      "tokenConsumption": [
        "rdzen.rozmiar.odstep-000",
        "rdzen.rozmiar.odstep-050",
        "rdzen.rozmiar.odstep-100",
        "rdzen.semantic.tlo-odwrocone",
        "rdzen.semantic.tekst-odwrocony",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.semantic.promien-interakcja",
        "rdzen.semantic.typografia-podpis",
        "rdzen.typografia.wysokosc-zwarta",
        "rdzen.typografia.rodzina-podstawowa",
        "rdzen.krycie.przezroczyste",
        "rdzen.krycie.pelne"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "stack",
          "children": [
            "ogonek-gora",
            "chmurka",
            "ogonek-dol"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.rozmiar.odstep-000"
            },
            "opacity": {
              "token": "rdzen.krycie.pelne"
            }
          }
        },
        {
          "id": "ogonek-gora",
          "element": "spacer",
          "bind": {
            "width": {
              "token": "rdzen.rozmiar.odstep-100"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-050"
            },
            "background": {
              "token": "rdzen.semantic.tlo-odwrocone"
            },
            "opacity": {
              "token": "rdzen.krycie.przezroczyste"
            }
          }
        },
        {
          "id": "chmurka",
          "element": "box",
          "children": [
            "tresc"
          ],
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-odwrocone"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "paddingY": {
              "token": "rdzen.rozmiar.odstep-050"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            }
          }
        },
        {
          "id": "tresc",
          "element": "text",
          "textFrom": "props.tresc.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-odwrocony"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwarta"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        },
        {
          "id": "ogonek-dol",
          "element": "spacer",
          "bind": {
            "width": {
              "token": "rdzen.rozmiar.odstep-100"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-050"
            },
            "background": {
              "token": "rdzen.semantic.tlo-odwrocone"
            },
            "opacity": {
              "token": "rdzen.krycie.pelne"
            }
          }
        }
      ],
      "variants": {
        "pozycja": {
          "dol": {
            "ogonek-gora": {
              "opacity": {
                "token": "rdzen.krycie.pelne"
              }
            },
            "ogonek-dol": {
              "opacity": {
                "token": "rdzen.krycie.przezroczyste"
              }
            }
          }
        }
      },
      "states": {
        "ukryta": {
          "root": {
            "opacity": {
              "token": "rdzen.krycie.przezroczyste"
            }
          }
        }
      }
    }
  },
  "dymek": {
    "osie": {
      "rozmiar": [
        "sredni",
        "duzy"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "tytul",
          "type": "string",
          "required": true,
          "default": "Ustawienia widoku",
          "description": "Nazwa panelu w jednej linii; wskazywana przez aria-labelledby i powtarzana w komunikacie otwarcia."
        },
        {
          "name": "tresc",
          "type": "string",
          "required": true,
          "default": "Zmiany dotyczą tylko Twojego konta i nie zmieniają widoku zespołu.",
          "description": "Treść kontekstowa panelu; mieści akapit, listę i pola formularza, w odróżnieniu od podpowiedzi."
        },
        {
          "name": "etykietaOdnosnika",
          "type": "string",
          "required": false,
          "default": "Dowiedz się więcej",
          "description": "Etykieta jedynego odnośnika w stopce panelu; puste pole usuwa odnośnik razem z odstępem."
        },
        {
          "name": "rozmiar",
          "type": "enum",
          "enum": [
            "sredni",
            "duzy"
          ],
          "required": false,
          "default": "sredni",
          "description": "Gęstość panelu: sredni mieści dwa akapity przy kotwicy w pasku narzędzi, duzy służy panelom z formularzem."
        },
        {
          "name": "idKotwicy",
          "type": "string",
          "required": true,
          "default": "przycisk-widok",
          "description": "Identyfikator elementu wyzwalającego; panel jest przy nim umieszczany, a po zamknięciu skupienie wraca dokładnie na ten element."
        }
      ],
      "states": {
        "otwarty": "Panel wyrysowany przy kotwicy, ze skupieniem przeniesionym na krzyżyk, czyli pierwszy element interaktywny w jego nagłówku.",
        "zamkniety": "Panel usunięty z widoku; kotwica traci aria-expanded, a treść panelu przestaje być czytana."
      },
      "behavior": {
        "kotwiczenie": "Panel przylega do krawędzi kotwicy z prześwitem jednego kroku skali odstępów (odstep-ciasny); gdy nie mieści się w oknie, przeskakuje na przeciwną stronę kotwicy zamiast wystawać poza ekran.",
        "zamykanie": "Zamykają go: krzyżyk, Escape, kliknięcie poza obszarem oraz wyjście skupienia Tab-em poza ostatni element panelu.",
        "przewijanie": "Panel podąża za kotwicą przy przewijaniu obszaru, w którym kotwica leży, i zamyka się, gdy kotwica wyjdzie poza widoczny fragment tego obszaru.",
        "interakcjaWewnatrz": "Wskaźnik i skupienie mogą pozostawać w panelu dowolnie długo — panel obsługuje odnośniki i pola, więc nie zamyka się po zjechaniu kursorem poza jego obszar.",
        "jedenNaRaz": "Otwarcie kolejnego dymka zamyka poprzedni; dymek nie przykrywa otwartego okna dialogowego, tylko zamyka się razem z nim."
      },
      "a11y": {
        "rola": "dialog bez modalności — tło pozostaje dostępne, panel nie zaciemnia strony.",
        "klawiatura": "Otwarcie przenosi skupienie na krzyżyk, Escape zamyka i przywraca je na kotwicę; Tab wychodzi poza panel i zamyka go, bo skupienie nie jest tu uwięzione.",
        "czytnikEkranu": "Kotwica ma aria-haspopup=dialog oraz aria-expanded; panel wskazuje tytuł przez aria-labelledby, więc otwarcie jest ogłaszane nazwą panelu.",
        "kolejnoscCzytania": "Panel jest wstawiany w drzewie zaraz za kotwicą, więc kolejność czytania odpowiada kolejności wizualnej także przy odwróconym umiejscowieniu."
      },
      "tokenConsumption": [
        "rdzen.komponent.okno-tlo",
        "rdzen.komponent.okno-naglowek",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.rozmiar.ikona-maly",
        "rdzen.semantic.obwodka-subtelna",
        "rdzen.semantic.promien-powierzchnia",
        "rdzen.semantic.odstep-zwykly",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.semantic.odstep-luzny",
        "rdzen.semantic.tekst-podstawowy",
        "rdzen.semantic.tekst-drugorzedny",
        "rdzen.semantic.tekst-link",
        "rdzen.semantic.typografia-naglowek-4",
        "rdzen.semantic.typografia-naglowek-3",
        "rdzen.semantic.typografia-tresc",
        "rdzen.semantic.typografia-tresc-duza",
        "rdzen.semantic.typografia-podpis",
        "rdzen.typografia.grubosc-pogrubiona",
        "rdzen.typografia.wysokosc-zwykla",
        "rdzen.typografia.rodzina-podstawowa",
        "rdzen.krycie.pelne",
        "rdzen.krycie.przezroczyste"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "stack",
          "children": [
            "naglowek",
            "tresc",
            "odnosnik"
          ],
          "bind": {
            "background": {
              "token": "rdzen.komponent.okno-tlo"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            },
            "radius": {
              "token": "rdzen.semantic.promien-powierzchnia"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "opacity": {
              "token": "rdzen.krycie.pelne"
            }
          }
        },
        {
          "id": "naglowek",
          "element": "row",
          "children": [
            "tytul",
            "zamknij"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            }
          }
        },
        {
          "id": "tytul",
          "element": "text",
          "textFrom": "props.tytul.default",
          "bind": {
            "color": {
              "token": "rdzen.komponent.okno-naglowek"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-naglowek-4"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-pogrubiona"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        },
        {
          "id": "zamknij",
          "element": "icon",
          "iconName": "krzyzyk",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-maly"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-maly"
            }
          }
        },
        {
          "id": "tresc",
          "element": "text",
          "textFrom": "props.tresc.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwykla"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        },
        {
          "id": "odnosnik",
          "element": "text",
          "textFrom": "props.etykietaOdnosnika.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-link"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-pogrubiona"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        }
      ],
      "variants": {
        "rozmiar": {
          "duzy": {
            "root": {
              "paddingX": {
                "token": "rdzen.semantic.odstep-luzny"
              },
              "paddingY": {
                "token": "rdzen.semantic.odstep-luzny"
              },
              "gap": {
                "token": "rdzen.semantic.odstep-zwykly"
              }
            },
            "tytul": {
              "fontSize": {
                "token": "rdzen.semantic.typografia-naglowek-3"
              }
            },
            "tresc": {
              "fontSize": {
                "token": "rdzen.semantic.typografia-tresc-duza"
              }
            }
          }
        }
      },
      "states": {
        "zamkniety": {
          "root": {
            "opacity": {
              "token": "rdzen.krycie.przezroczyste"
            }
          }
        }
      }
    }
  },
  "menu-kontekstowe": {
    "osie": {
      "gestosc": [
        "zwykla",
        "zwarta"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "akcjaPodstawowa",
          "type": "string",
          "required": false,
          "default": "Edytuj",
          "description": "Etykieta pierwszej akcji zestawu domyślnego; czasownik w trybie rozkazującym, bez nazwy obiektu, bo obiekt wynika z miejsca wywołania."
        },
        {
          "name": "akcjaWtorna",
          "type": "string",
          "required": false,
          "default": "Powiel",
          "description": "Etykieta drugiej akcji zestawu domyślnego, oddzielonej od akcji destrukcyjnej linią rozdzielającą."
        },
        {
          "name": "akcjaDestrukcyjna",
          "type": "string",
          "required": false,
          "default": "Usuń",
          "description": "Etykieta akcji nieodwracalnej; zawsze ostatnia w menu i zawsze pod separatorem, żeby nie dało się jej trafić rozpędem."
        },
        {
          "name": "pozycje",
          "type": "array",
          "required": false,
          "default": null,
          "description": "Pełna lista akcji zastępująca zestaw domyślny; każdy wpis podaje etykietę, nazwę ikony, znacznik destrukcyjności i powód niedostępności."
        },
        {
          "name": "gestosc",
          "type": "enum",
          "enum": [
            "zwykla",
            "zwarta"
          ],
          "required": false,
          "default": "zwykla",
          "description": "Wysokość wierszy: zwykla dla menu wywoływanego na stronie, zwarta dla menu w wierszu tabeli, gdzie nie może zasłonić sąsiednich wierszy."
        },
        {
          "name": "idElementuDocelowego",
          "type": "string",
          "required": true,
          "default": "wiersz-faktura-2401",
          "description": "Identyfikator elementu, którego dotyczą akcje; do niego wraca skupienie po zamknięciu menu."
        }
      ],
      "states": {
        "otwarte": "Lista wyrysowana przy wskaźniku lub przy elemencie docelowym, ze skupieniem na pierwszej dostępnej pozycji.",
        "wskazanie": "Pozycja pod wskaźnikiem albo wybrana strzałkami dostaje tło i mocniejszy kolor tekstu; w danej chwili wskazana jest dokładnie jedna pozycja.",
        "zamkniete": "Menu usunięte z widoku po wyborze akcji, Escape lub kliknięciu poza obszarem; element docelowy odzyskuje skupienie."
      },
      "behavior": {
        "otwieranie": "Prawy przycisk myszy na elemencie docelowym, klawisz menu kontekstowego lub Shift+F10; menu pojawia się w miejscu wskaźnika, a przy wywołaniu z klawiatury przy krawędzi elementu.",
        "nawigacja": "Strzałki w górę i w dół przechodzą po pozycjach z zawijaniem na końcach, Home i End skaczą do skrajnych, a wpisanie litery przenosi wskazanie do pierwszej pozycji zaczynającej się od tej litery.",
        "wybor": "Enter, spacja lub kliknięcie uruchamia akcję i zamyka menu w tej samej chwili; akcja destrukcyjna dodatkowo prosi o potwierdzenie w oknie dialogowym.",
        "przyleganie": "Przy dolnej krawędzi okna menu rozwija się w górę, przy prawej — w lewo; nigdy nie wychodzi poza obszar widoczny i nie tworzy własnego paska przewijania.",
        "pozycjeNiedostepne": "Akcja bez uprawnień zostaje w liście jako nieaktywna, z powodem w tekście pomocniczym — nie znika, żeby położenie pozostałych pozycji się nie zmieniało."
      },
      "a11y": {
        "rola": "menu z pozycjami o roli menuitem; separator ma rolę separator i jest pomijany przy nawigacji strzałkami.",
        "klawiatura": "Otwarcie ustawia skupienie na pierwszej dostępnej pozycji, Escape zamyka bez akcji i przywraca skupienie na element docelowy; Tab zamyka menu i przenosi skupienie dalej po stronie.",
        "czytnikEkranu": "Element docelowy ma aria-haspopup=menu i aria-expanded; pozycja niedostępna ma aria-disabled wraz z powodem, a akcja destrukcyjna jest rozpoznawalna po słowie w etykiecie, nie po samym kolorze.",
        "obszarWskazania": "Cały wiersz pozycji jest polem klikalnym o wysokości co najmniej 32 pikseli w gęstości zwartej i 40 pikseli w zwykłej, razem z ikoną i dopełnieniem."
      },
      "tokenConsumption": [
        "rdzen.funkcjonalne.nawigacja-tlo",
        "rdzen.funkcjonalne.nawigacja-pozycja-tekst",
        "rdzen.funkcjonalne.nawigacja-pozycja-aktywna",
        "rdzen.funkcjonalne.nawigacja-separator",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.rozmiar.ikona-maly",
        "rdzen.rozmiar.odstep-000",
        "rdzen.rozmiar.odstep-025",
        "rdzen.rozmiar.odstep-050",
        "rdzen.semantic.obwodka-subtelna",
        "rdzen.semantic.promien-interakcja",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.semantic.odstep-zwykly",
        "rdzen.semantic.typografia-tresc",
        "rdzen.semantic.akcja-destrukcyjna",
        "rdzen.semantic.tlo-akcent-subtelne",
        "rdzen.typografia.rodzina-podstawowa",
        "rdzen.krycie.pelne",
        "rdzen.krycie.przezroczyste"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "stack",
          "children": [
            "pozycja-1",
            "pozycja-2",
            "separator",
            "pozycja-3"
          ],
          "bind": {
            "background": {
              "token": "rdzen.funkcjonalne.nawigacja-tlo"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            },
            "paddingY": {
              "token": "rdzen.rozmiar.odstep-050"
            },
            "gap": {
              "token": "rdzen.rozmiar.odstep-000"
            },
            "opacity": {
              "token": "rdzen.krycie.pelne"
            }
          }
        },
        {
          "id": "pozycja-1",
          "element": "row",
          "children": [
            "ikona-1",
            "etykieta-1"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.rozmiar.odstep-050"
            }
          }
        },
        {
          "id": "ikona-1",
          "element": "icon",
          "iconName": "olowek",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.nawigacja-pozycja-tekst"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-maly"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-maly"
            }
          }
        },
        {
          "id": "etykieta-1",
          "element": "text",
          "textFrom": "props.akcjaPodstawowa.default",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.nawigacja-pozycja-tekst"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        },
        {
          "id": "pozycja-2",
          "element": "row",
          "children": [
            "ikona-2",
            "etykieta-2"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.rozmiar.odstep-050"
            }
          }
        },
        {
          "id": "ikona-2",
          "element": "icon",
          "iconName": "plus",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.nawigacja-pozycja-tekst"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-maly"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-maly"
            }
          }
        },
        {
          "id": "etykieta-2",
          "element": "text",
          "textFrom": "props.akcjaWtorna.default",
          "bind": {
            "color": {
              "token": "rdzen.funkcjonalne.nawigacja-pozycja-tekst"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        },
        {
          "id": "separator",
          "element": "spacer",
          "bind": {
            "height": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "background": {
              "token": "rdzen.funkcjonalne.nawigacja-separator"
            }
          }
        },
        {
          "id": "pozycja-3",
          "element": "row",
          "children": [
            "ikona-3",
            "etykieta-3"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.rozmiar.odstep-050"
            }
          }
        },
        {
          "id": "ikona-3",
          "element": "icon",
          "iconName": "kosz",
          "bind": {
            "color": {
              "token": "rdzen.semantic.akcja-destrukcyjna"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-maly"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-maly"
            }
          }
        },
        {
          "id": "etykieta-3",
          "element": "text",
          "textFrom": "props.akcjaDestrukcyjna.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.akcja-destrukcyjna"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        }
      ],
      "variants": {
        "gestosc": {
          "zwarta": {
            "root": {
              "paddingY": {
                "token": "rdzen.rozmiar.odstep-025"
              }
            },
            "pozycja-1": {
              "paddingY": {
                "token": "rdzen.rozmiar.odstep-025"
              }
            },
            "pozycja-2": {
              "paddingY": {
                "token": "rdzen.rozmiar.odstep-025"
              }
            },
            "pozycja-3": {
              "paddingY": {
                "token": "rdzen.rozmiar.odstep-025"
              }
            }
          }
        }
      },
      "states": {
        "wskazanie": {
          "pozycja-1": {
            "background": {
              "token": "rdzen.semantic.tlo-akcent-subtelne"
            }
          },
          "ikona-1": {
            "color": {
              "token": "rdzen.funkcjonalne.nawigacja-pozycja-aktywna"
            }
          },
          "etykieta-1": {
            "color": {
              "token": "rdzen.funkcjonalne.nawigacja-pozycja-aktywna"
            }
          }
        },
        "zamkniete": {
          "root": {
            "opacity": {
              "token": "rdzen.krycie.przezroczyste"
            }
          }
        }
      }
    }
  },
  "pusty-stan": {
    "osie": {
      "powod": [
        "brak-danych",
        "brak-wynikow",
        "blad-pobierania"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "powod",
          "type": "enum",
          "enum": [
            "brak-danych",
            "brak-wynikow",
            "blad-pobierania"
          ],
          "required": true,
          "default": "brak-danych",
          "description": "Przyczyna pustki: nic jeszcze nie utworzono, filtr nie zwrócił trafień albo pobranie się nie udało. Każda przyczyna ma inną akcję, więc nie wolno ich łączyć w jeden komunikat."
        },
        {
          "name": "tytul",
          "type": "string",
          "required": true,
          "default": "Brak pozycji na liście",
          "description": "Nazwanie braku w jednej linii; bez przeprosin i bez powtarzania nazwy widoku, która jest już w nagłówku strony."
        },
        {
          "name": "opis",
          "type": "string",
          "required": true,
          "default": "Dodaj pierwszą pozycję, a pojawi się na tej liście.",
          "description": "Jedno zdanie z konkretnym następnym krokiem, dobrane do jednej przyczyny — wartość domyślna dotyczy przyczyny brak-danych. Przy przyczynie brak-wynikow wymienia aktywne filtry, przy blad-pobierania mówi, czy dane zostaną pobrane ponownie samoczynnie."
        },
        {
          "name": "etykietaAkcji",
          "type": "string",
          "required": false,
          "default": "Dodaj pozycję",
          "description": "Etykieta jedynego przycisku. Przy przyczynach brak-danych i brak-wynikow brzmi tak samo jak przycisk główny nad listą, żeby obie drogi prowadziły do tego samego formularza; przy blad-pobierania jest to etykieta ponowienia."
        },
        {
          "name": "akcjaDostepna",
          "type": "boolean",
          "required": false,
          "default": true,
          "description": "Wartość fałsz usuwa przycisk, gdy osoba nie ma uprawnień do tworzenia; wtedy opis wskazuje, do kogo zwrócić się o dostęp."
        }
      ],
      "states": {
        "bezAkcji": "Stan dla osoby bez uprawnień do tworzenia (akcjaDostepna = fałsz): przycisk gaśnie i wypada z kolejności Tab, a ciężar komunikatu przejmuje opis, który podaje, do kogo zwrócić się o dostęp. Tytuł i ikona zostają bez zmian."
      },
      "behavior": {
        "kiedyPokazywany": "Wyłącznie po zakończonym pobraniu, które zwróciło zero rekordów; w trakcie pobierania jego miejsce zajmuje wskaźnik ładowania, żeby nie migać komunikatem o pustce.",
        "wysokosc": "Blok zajmuje wysokość obszaru przeznaczonego na listę, więc pojawienie się danych nie przesuwa nagłówka ani stronicowania.",
        "akcja": "Przycisk wywołuje tę samą akcję co przycisk główny nad listą; przy przyczynie blad-pobierania zamienia się w ponowienie żądania bez przeładowania strony.",
        "filtry": "Przy przyczynie brak-wynikow opis wymienia aktywne filtry, a akcja je czyści — czyszczenie nie usuwa frazy wpisanej w wyszukiwarce.",
        "brakGrafiki": "Ikona jest jedyną ozdobą i pozostaje ta sama dla wszystkich trzech przyczyn — zmienia się tylko jej kolor; komunikat pozostaje czytelny po jej wyłączeniu i nie zależy od obrazu z serwera."
      },
      "a11y": {
        "rola": "status z aria-live=polite na obszarze listy, dzięki czemu przejście z wyników na pustkę jest ogłaszane bez przenoszenia skupienia.",
        "klawiatura": "Przycisk akcji jest pierwszym przystankiem Tab-em w obszarze listy i kolejność nie zmienia się po zniknięciu danych; gdy przycisku nie ma (akcjaDostepna = fałsz), obszar listy nie ma żadnego przystanku i Tab przechodzi od razu do stronicowania.",
        "czytnikEkranu": "Ikona jest oznaczona aria-hidden jako dekoracja; odczyt idzie w kolejności tytuł, opis, etykieta akcji, a wariant przyczyny jest rozpoznawalny z treści, nie z koloru.",
        "kontrast": "Wariant blad-pobierania używa pary tło–treść ze skali stanu błędu, więc komunikat zachowuje kontrast także po zmianie palety marki."
      },
      "tokenConsumption": [
        "rdzen.semantic.tlo-powierzchnia",
        "rdzen.semantic.obwodka-subtelna",
        "rdzen.semantic.promien-powierzchnia",
        "rdzen.semantic.odstep-zwykly",
        "rdzen.semantic.odstep-luzny",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.semantic.tekst-podstawowy",
        "rdzen.semantic.tekst-drugorzedny",
        "rdzen.semantic.tekst-wylaczony",
        "rdzen.semantic.typografia-naglowek-4",
        "rdzen.semantic.typografia-podpis",
        "rdzen.semantic.typografia-przycisk",
        "rdzen.semantic.promien-interakcja",
        "rdzen.semantic.akcja-drugorzedna",
        "rdzen.semantic.stan-blad-tlo",
        "rdzen.semantic.stan-blad-tresc",
        "rdzen.semantic.obwodka-blad",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.rozmiar.ikona-wielki",
        "rdzen.rozmiar.odstep-050",
        "rdzen.komponent.przycisk-tlo",
        "rdzen.komponent.przycisk-tresc-odwrocona",
        "rdzen.typografia.grubosc-pogrubiona",
        "rdzen.typografia.wysokosc-zwarta",
        "rdzen.typografia.wysokosc-zwykla",
        "rdzen.typografia.rodzina-podstawowa",
        "rdzen.krycie.przezroczyste"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "stack",
          "children": [
            "ikona",
            "tytul",
            "opis",
            "akcja"
          ],
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-powierzchnia"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-subtelna"
            },
            "radius": {
              "token": "rdzen.semantic.promien-powierzchnia"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-luzny"
            },
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            }
          }
        },
        {
          "id": "ikona",
          "element": "icon",
          "iconName": "informacja",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "width": {
              "token": "rdzen.rozmiar.ikona-wielki"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-wielki"
            }
          }
        },
        {
          "id": "tytul",
          "element": "text",
          "textFrom": "props.tytul.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-naglowek-4"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-pogrubiona"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwarta"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        },
        {
          "id": "opis",
          "element": "text",
          "textFrom": "props.opis.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwykla"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        },
        {
          "id": "akcja",
          "element": "box",
          "children": [
            "akcja-etykieta"
          ],
          "bind": {
            "background": {
              "token": "rdzen.komponent.przycisk-tlo"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.rozmiar.odstep-050"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            }
          }
        },
        {
          "id": "akcja-etykieta",
          "element": "text",
          "textFrom": "props.etykietaAkcji.default",
          "bind": {
            "color": {
              "token": "rdzen.komponent.przycisk-tresc-odwrocona"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-przycisk"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-pogrubiona"
            },
            "fontFamily": {
              "token": "rdzen.typografia.rodzina-podstawowa"
            }
          }
        }
      ],
      "variants": {
        "powod": {
          "brak-wynikow": {
            "ikona": {
              "color": {
                "token": "rdzen.semantic.tekst-wylaczony"
              }
            },
            "akcja": {
              "background": {
                "token": "rdzen.semantic.akcja-drugorzedna"
              }
            }
          },
          "blad-pobierania": {
            "root": {
              "background": {
                "token": "rdzen.semantic.stan-blad-tlo"
              },
              "borderColor": {
                "token": "rdzen.semantic.obwodka-blad"
              }
            },
            "ikona": {
              "color": {
                "token": "rdzen.semantic.stan-blad-tresc"
              }
            },
            "tytul": {
              "color": {
                "token": "rdzen.semantic.stan-blad-tresc"
              }
            },
            "opis": {
              "color": {
                "token": "rdzen.semantic.stan-blad-tresc"
              }
            }
          }
        }
      },
      "states": {
        "bezAkcji": {
          "akcja": {
            "opacity": {
              "token": "rdzen.krycie.przezroczyste"
            }
          }
        }
      }
    }
  },
  "baner": {
    "osie": {
      "ton": [
        "ostrzezenie",
        "informacja"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "ton",
          "type": "enum",
          "enum": [
            "ostrzezenie",
            "informacja"
          ],
          "required": true,
          "default": "ostrzezenie",
          "description": "Wymowa komunikatu. Komponent zna tylko dwie barwy odziedziczone sprzed ujednolicenia i nie reaguje na paletę marki — dlatego nie ma tu tonu sukcesu ani błędu."
        },
        {
          "name": "tresc",
          "type": "string",
          "required": true,
          "default": "Prace serwisowe w sobotę od 22:00 do 2:00",
          "description": "Komunikat dotyczący całego serwisu, nie pojedynczego widoku; jedno zdanie mieszczące się w jednej linii na ekranie szerokości 1280 pikseli."
        },
        {
          "name": "etykietaAkcji",
          "type": "string",
          "required": false,
          "default": "Szczegóły",
          "description": "Etykieta jedynego odnośnika prowadzącego do strony z pełnym opisem; baner nie przyjmuje przycisku wysyłającego dane."
        },
        {
          "name": "mozliwoscZamkniecia",
          "type": "boolean",
          "required": false,
          "default": true,
          "description": "Fałsz usuwa krzyżyk dla komunikatów prawnych, których nie wolno odrzucić; wtedy baner znika dopiero po stronie serwera."
        }
      ],
      "states": {
        "widoczny": "Pasek na pełną szerokość nad nagłówkiem strony; przesuwa układ w dół, zamiast go przykrywać.",
        "zamkniety": "Po odrzuceniu baner jest usuwany z dokumentu, a decyzja zapisywana na czas sesji przeglądarki — dlatego przepis nie ma dla tego stanu żadnego nadpisania wizualnego."
      },
      "behavior": {
        "umiejscowienie": "Jeden baner na dokument, ponad nagłówkiem strony i ponad okruszkami; kolejne komunikaty czekają w kolejce i pojawiają się po zamknięciu poprzedniego.",
        "zamkniecie": "Krzyżyk usuwa baner i zapamiętuje decyzję na czas sesji, więc ten sam komunikat nie wraca po przejściu na inną stronę serwisu.",
        "zakresTresci": "Baner mówi o stanie całego serwisu — przerwa techniczna, zmiana regulaminu. Wynik operacji użytkownika należy do powiadomienia, nie tutaj.",
        "wycofanie": "Komponent nie został przepisany na tokeny marki: kolory i odstępy pochodzą z prymitywów sprzed ujednolicenia, więc marki Alfa, Beta i Gamma wyglądają w nim identycznie. Nowe wdrożenia mają używać powiadomienia na poziomie strony.",
        "brakZaokraglenia": "Pasek nie ma promienia ani obwódki, bo w warstwie sprzed ujednolicenia nie istniały odpowiadające im wartości — kształt jest wynikiem braku, nie decyzji projektowej."
      },
      "a11y": {
        "rola": "region z etykietą „Komunikat serwisu”, umieszczony przed nawigacją główną w kolejności czytania.",
        "klawiatura": "Odnośnik i krzyżyk są kolejnymi przystankami Tab-em przed nawigacją; Escape nie zamyka banera, bo baner nigdy nie przejmuje skupienia sam z siebie.",
        "czytnikEkranu": "Treść jest czytana przy wejściu na stronę jako część regionu, bez aria-live, żeby nie przerywać czytania w trakcie pracy na stronie.",
        "brakSygnaluKoloru": "Ton nie jest przekazywany kolorem: słowo „Uwaga” albo „Informacja” jest częścią treści, bo odziedziczone barwy nie spełniają wymogu kontrastu w motywie ciemnym."
      },
      "tokenConsumption": [
        "rdzen.color.sygnalowy-stary",
        "rdzen.color.akcent-stary",
        "rdzen.rozmiar.odstep-stary"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "row",
          "children": [
            "ikona",
            "tresc",
            "akcja",
            "zamknij"
          ],
          "bind": {
            "background": {
              "token": "rdzen.color.sygnalowy-stary"
            },
            "paddingX": {
              "token": "rdzen.rozmiar.odstep-stary"
            },
            "paddingY": {
              "token": "rdzen.rozmiar.odstep-stary"
            },
            "gap": {
              "token": "rdzen.rozmiar.odstep-stary"
            }
          }
        },
        {
          "id": "ikona",
          "element": "icon",
          "iconName": "ostrzezenie",
          "bind": {
            "color": {
              "token": "rdzen.color.akcent-stary"
            }
          }
        },
        {
          "id": "tresc",
          "element": "text",
          "textFrom": "props.tresc.default",
          "bind": {
            "color": {
              "token": "rdzen.color.akcent-stary"
            }
          }
        },
        {
          "id": "akcja",
          "element": "text",
          "textFrom": "props.etykietaAkcji.default",
          "bind": {
            "color": {
              "token": "rdzen.color.akcent-stary"
            }
          }
        },
        {
          "id": "zamknij",
          "element": "icon",
          "iconName": "krzyzyk",
          "bind": {
            "color": {
              "token": "rdzen.color.akcent-stary"
            }
          }
        }
      ],
      "variants": {
        "ton": {
          "informacja": {
            "root": {
              "background": {
                "token": "rdzen.color.akcent-stary"
              }
            },
            "ikona": {
              "color": {
                "token": "rdzen.color.sygnalowy-stary"
              }
            },
            "tresc": {
              "color": {
                "token": "rdzen.color.sygnalowy-stary"
              }
            },
            "akcja": {
              "color": {
                "token": "rdzen.color.sygnalowy-stary"
              }
            },
            "zamknij": {
              "color": {
                "token": "rdzen.color.sygnalowy-stary"
              }
            }
          }
        }
      }
    }
  },
  "sekcja-powitalna": {
    "osie": {
      "tlo": [
        "powierzchnia",
        "akcent",
        "odwrocone"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "tlo",
          "type": "enum",
          "enum": [
            "powierzchnia",
            "akcent",
            "odwrocone"
          ],
          "required": true,
          "default": "powierzchnia",
          "description": "Traktowanie tła sekcji: neutralna powierzchnia, subtelny akcent marki albo odwrócenie na ciemne tło z jasnym tekstem."
        },
        {
          "name": "nadtytul",
          "type": "string",
          "required": false,
          "default": "Nowość w wersji 4",
          "description": "Krótkie wyróżnienie nad nagłówkiem; zwykły tekst, nie nagłówek, więc nie wchodzi do konspektu strony."
        },
        {
          "name": "naglowek",
          "type": "string",
          "required": true,
          "default": "Zarządzaj flotą w jednym miejscu",
          "description": "Obietnica produktu w jednym zdaniu; jedyny nagłówek pierwszego poziomu na stronie startowej."
        },
        {
          "name": "podtytul",
          "type": "string",
          "required": true,
          "default": "Zużycie, przeglądy i koszty bez przełączania między systemami.",
          "description": "Rozwinięcie obietnicy o to, co użytkownik dostaje; nie powtarza słów z nagłówka."
        },
        {
          "name": "etykietaAkcji",
          "type": "string",
          "required": true,
          "default": "Załóż konto",
          "description": "Wezwanie główne; próbka renderu bierze wartość domyślną."
        },
        {
          "name": "etykietaAkcjiDrugorzednej",
          "type": "string",
          "required": false,
          "default": "Zobacz demonstrację",
          "description": "Wyjście dla niezdecydowanych; pominięcie zostawia w sekcji jedno wezwanie, bez pustego miejsca po drugim."
        }
      ],
      "states": {
        "spoczynek": "Sekcja nie ma własnych stanów interakcyjnych: tło, typografia i dopełnienie są takie same przez cały czas życia widoku, a najechanie i skupienie wnoszą wyłącznie oba wezwania."
      },
      "behavior": {
        "jedenNaglowekPierwszegoPoziomu": "Nagłówek sekcji jest h1 strony startowej; nadtytuł stoi wizualnie wyżej, ale w kodzie jest zwykłym akapitem, żeby nie rozbijać konspektu.",
        "ukladWezwan": "Wezwania stoją obok siebie, główne przed drugorzędnym. Poniżej progu małego ekranu układają się jedno pod drugim i rozciągają na pełną szerokość kolumny.",
        "wzrostWPionie": "Dłuższy nagłówek lub podtytuł nie jest przycinany — sekcja rośnie w pionie, a dopełnienie górne i dolne pozostaje niezmienione.",
        "kontrastNaOdwroceniu": "Przy tlo=odwrocone nadtytuł, nagłówek, podtytuł oraz tekst i obwódka wezwania drugorzędnego przechodzą na warstwę odwróconą jednocześnie; w jednej sekcji nie miesza się jasnych i ciemnych tekstów."
      },
      "a11y": {
        "rola": "Element section z aria-labelledby wskazującym nagłówek; jest pierwszym punktem orientacyjnym po odsyłaczu pomijającym nawigację.",
        "klawiatura": "Dwa przystanki Tab w kolejności wizualnej: wezwanie główne, potem drugorzędne. Sama sekcja skupienia nie zbiera, bo nie ma własnej interakcji.",
        "czytnikEkranu": "Nadtytuł jest czytany przed nagłówkiem jako część opisu sekcji; ozdobne tło i grafiki dekoracyjne są usuwane z drzewa dostępności."
      },
      "tokenConsumption": [
        "rdzen.semantic.tlo-powierzchnia",
        "rdzen.semantic.tlo-akcent-subtelne",
        "rdzen.semantic.tlo-odwrocone",
        "rdzen.semantic.tekst-podstawowy",
        "rdzen.semantic.tekst-drugorzedny",
        "rdzen.semantic.tekst-odwrocony",
        "rdzen.semantic.akcja-podstawowa",
        "rdzen.semantic.obwodka-wyrazna",
        "rdzen.semantic.promien-powierzchnia",
        "rdzen.semantic.promien-interakcja",
        "rdzen.semantic.odstep-luzny",
        "rdzen.semantic.odstep-sekcja",
        "rdzen.semantic.odstep-zwykly",
        "rdzen.semantic.odstep-ciasny",
        "rdzen.semantic.odstep-przylegly",
        "rdzen.semantic.typografia-naglowek-2",
        "rdzen.semantic.typografia-tresc",
        "rdzen.semantic.typografia-podpis",
        "rdzen.semantic.typografia-przycisk",
        "rdzen.typografia.grubosc-mocna",
        "rdzen.typografia.grubosc-srednia",
        "rdzen.typografia.wysokosc-ciasna",
        "rdzen.typografia.wysokosc-zwykla",
        "rdzen.komponent.przycisk-tlo",
        "rdzen.komponent.przycisk-tresc",
        "rdzen.komponent.przycisk-tresc-odwrocona",
        "rdzen.rozmiar.obwodka-cienka",
        "rdzen.rozmiar.odstep-600"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "stack",
          "children": [
            "nadtytul",
            "naglowek",
            "podtytul",
            "wezwania"
          ],
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-powierzchnia"
            },
            "radius": {
              "token": "rdzen.semantic.promien-powierzchnia"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-luzny"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-sekcja"
            },
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            },
            "width": {
              "token": "rdzen.rozmiar.odstep-600"
            }
          }
        },
        {
          "id": "nadtytul",
          "element": "text",
          "textFrom": "props.nadtytul.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.akcja-podstawowa"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-podpis"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            }
          }
        },
        {
          "id": "naglowek",
          "element": "text",
          "textFrom": "props.naglowek.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-naglowek-2"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-mocna"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-ciasna"
            }
          }
        },
        {
          "id": "podtytul",
          "element": "text",
          "textFrom": "props.podtytul.default",
          "bind": {
            "color": {
              "token": "rdzen.semantic.tekst-drugorzedny"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-tresc"
            },
            "lineHeight": {
              "token": "rdzen.typografia.wysokosc-zwykla"
            }
          }
        },
        {
          "id": "wezwania",
          "element": "row",
          "children": [
            "wezwanieGlowne",
            "wezwanieDrugorzedne"
          ],
          "bind": {
            "gap": {
              "token": "rdzen.semantic.odstep-ciasny"
            }
          }
        },
        {
          "id": "wezwanieGlowne",
          "element": "box",
          "children": [
            "tekstWezwaniaGlownego"
          ],
          "bind": {
            "background": {
              "token": "rdzen.komponent.przycisk-tlo"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-przylegly"
            }
          }
        },
        {
          "id": "tekstWezwaniaGlownego",
          "element": "text",
          "textFrom": "props.etykietaAkcji.default",
          "bind": {
            "color": {
              "token": "rdzen.komponent.przycisk-tresc-odwrocona"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-przycisk"
            },
            "fontWeight": {
              "token": "rdzen.typografia.grubosc-srednia"
            }
          }
        },
        {
          "id": "wezwanieDrugorzedne",
          "element": "box",
          "children": [
            "tekstWezwaniaDrugorzednego"
          ],
          "bind": {
            "background": {
              "token": "rdzen.semantic.tlo-powierzchnia"
            },
            "borderColor": {
              "token": "rdzen.semantic.obwodka-wyrazna"
            },
            "borderWidth": {
              "token": "rdzen.rozmiar.obwodka-cienka"
            },
            "radius": {
              "token": "rdzen.semantic.promien-interakcja"
            },
            "paddingX": {
              "token": "rdzen.semantic.odstep-zwykly"
            },
            "paddingY": {
              "token": "rdzen.semantic.odstep-przylegly"
            }
          }
        },
        {
          "id": "tekstWezwaniaDrugorzednego",
          "element": "text",
          "textFrom": "props.etykietaAkcjiDrugorzednej.default",
          "bind": {
            "color": {
              "token": "rdzen.komponent.przycisk-tresc"
            },
            "fontSize": {
              "token": "rdzen.semantic.typografia-przycisk"
            }
          }
        }
      ],
      "variants": {
        "tlo": {
          "akcent": {
            "root": {
              "background": {
                "token": "rdzen.semantic.tlo-akcent-subtelne"
              }
            },
            "wezwanieDrugorzedne": {
              "background": {
                "token": "rdzen.semantic.tlo-akcent-subtelne"
              }
            }
          },
          "odwrocone": {
            "root": {
              "background": {
                "token": "rdzen.semantic.tlo-odwrocone"
              }
            },
            "nadtytul": {
              "color": {
                "token": "rdzen.semantic.tekst-odwrocony"
              }
            },
            "naglowek": {
              "color": {
                "token": "rdzen.semantic.tekst-odwrocony"
              }
            },
            "podtytul": {
              "color": {
                "token": "rdzen.semantic.tekst-odwrocony"
              }
            },
            "wezwanieDrugorzedne": {
              "background": {
                "token": "rdzen.semantic.tlo-odwrocone"
              },
              "borderColor": {
                "token": "rdzen.semantic.tekst-odwrocony"
              }
            },
            "tekstWezwaniaDrugorzednego": {
              "color": {
                "token": "rdzen.semantic.tekst-odwrocony"
              }
            }
          }
        }
      },
      "states": {}
    }
  },
  "separator": {
    "osie": null,
    "kontrakt": {
      "props": [
        {
          "name": "dekoracyjny",
          "type": "boolean",
          "required": false,
          "default": true,
          "description": "Domyślnie linia tylko porządkuje wzrok i jest pomijana w odczycie. Ustawienie false ogłasza podział także czytnikowi ekranu — do użycia tam, gdzie linia oddziela dwie różne grupy danych, nie dwa akapity tej samej treści."
        }
      ],
      "states": {},
      "behavior": {
        "szerokosc": "Kreska ma zadaną szerokość 48 pikseli, żeby próbka i pusty kontener nie zwinęły jej do zera; w układzie rozciąga się do szerokości rodzica, więc w karcie kończy się na jej dopełnieniu, a nie na krawędzi karty.",
        "grubosc": "Kreska ma 2 piksele wysokości i kolor obwódki subtelnej — nie jest obwódką rodzica, tylko osobnym paskiem, dlatego nie znika przy zaokrąglaniu do połowy piksela.",
        "odstepWbudowany": "Odstęp zwykły nad i pod linią jest częścią komponentu. Sąsiednie sekcje nie dokładają własnych marginesów, bo przerwa urosłaby dwukrotnie.",
        "tylkoPoziomy": "Wersji pionowej nie ma. Rozdzielenie kolumn robi się odstępem układu — pionowa kreska wymagałaby znanej wysokości rodzica, której separator nie zna.",
        "brakStanow": "Separator nie przyjmuje kursora ani skupienia i nie zmienia wyglądu w żadnej sytuacji; nie ma stanu spoczynku, bo nie ma z czym go zestawić.",
        "gdyNiepotrzebny": "Gdy grupy treści są już rozdzielone tłem powierzchni albo nagłówkiem, linii się nie dokłada — dwa sygnały podziału naraz zaszumiają układ."
      },
      "a11y": {
        "rola": "separator przy dekoracyjny = false, w przeciwnym razie none",
        "czytnikEkranu": "Domyślnie linia jest ukryta przez aria-hidden. Przy dekoracyjny = false czytnik ogłasza podział raz, bez zaglądania w treść sąsiadów.",
        "klawiatura": "Nie ma go w kolejności Tab i nie da się na nim zatrzymać — nie niesie ani akcji, ani treści.",
        "kontrast": "Linia nie jest elementem sterującym ani nie niesie treści, więc progowi 3:1 formalnie nie podlega. Przy dekoracyjny = false podział ma jednak znaczenie, dlatego obwódka subtelna jest sprawdzana pod kątem widoczności zarówno na tle powierzchni, jak i na tle strony."
      },
      "tokenConsumption": [
        "rdzen.semantic.odstep-zwykly",
        "rdzen.rozmiar.odstep-600",
        "rdzen.rozmiar.odstep-025",
        "rdzen.semantic.obwodka-subtelna"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "stack",
          "children": [
            "linia"
          ],
          "bind": {
            "paddingY": {
              "token": "rdzen.semantic.odstep-zwykly"
            }
          }
        },
        {
          "id": "linia",
          "element": "spacer",
          "bind": {
            "width": {
              "token": "rdzen.rozmiar.odstep-600"
            },
            "height": {
              "token": "rdzen.rozmiar.odstep-025"
            },
            "background": {
              "token": "rdzen.semantic.obwodka-subtelna"
            }
          }
        }
      ]
    }
  },
  "ikona": {
    "osie": {
      "rozmiar": [
        "maly",
        "sredni",
        "duzy",
        "wielki"
      ]
    },
    "kontrakt": {
      "props": [
        {
          "name": "nazwa",
          "type": "enum",
          "enum": [
            "strzalka-prawo",
            "strzalka-lewo",
            "strzalka-dol",
            "strzalka-gora",
            "ptaszek",
            "krzyzyk",
            "plus",
            "minus",
            "lupa",
            "dzwonek",
            "kosz",
            "olowek",
            "informacja",
            "ostrzezenie",
            "kalendarz",
            "menu"
          ],
          "required": true,
          "default": "informacja",
          "description": "Nazwa rysunku z zestawu; próbka renderu bierze wartość domyślną. Zestaw jest zamknięty — nowy rysunek wchodzi przez zmianę w źródle, nie propem."
        },
        {
          "name": "rozmiar",
          "type": "enum",
          "enum": [
            "maly",
            "sredni",
            "duzy",
            "wielki"
          ],
          "required": true,
          "default": "sredni",
          "description": "Bok kwadratu ikony: 16, 20, 24 albo 32 piksele. Dobierany do rozmiaru tekstu, przy którym ikona stoi."
        },
        {
          "name": "etykieta",
          "type": "string",
          "required": true,
          "default": "Informacja dodatkowa",
          "description": "Znaczenie ikony wypowiedziane słowem. Wymagane, dopóki prop dekoracyjna nie zostanie ustawiony na true."
        },
        {
          "name": "dekoracyjna",
          "type": "boolean",
          "required": false,
          "default": false,
          "description": "Ikona powtarza sens sąsiedniego napisu — wtedy jest ukrywana przed czytnikiem, a etykieta przestaje być wymagana."
        }
      ],
      "states": {},
      "behavior": {
        "jedenKolor": "Cały rysunek bierze kolor z jednego bindingu na korzeniu; komponent nadrzędny (przycisk, powiadomienie) nadpisuje go swoim tokenem treści, a ikona nigdy nie miesza dwóch kolorów w jednym rysunku.",
        "siatkaRysunku": "Rysunek jest wpisany w kwadrat o boku równym rozmiarowi i optycznie wyrównany do siatki 16 pikseli. Poniżej 16 kreska przestaje trafiać w piksel, dlatego mniejszego wariantu nie ma.",
        "wyrownanieDoTekstu": "Przy napisie ikona jest wyrównywana do linii bazowej, nie do środka wiersza — przy luźnej interlinii wyśrodkowanie wygląda na opadnięte.",
        "nieznanaNazwa": "Wartość spoza zestawu — możliwa, gdy nazwa przychodzi z danych, a nie z kodu — nie zostawia pustego miejsca: rysowany jest krzyzyk i do konsoli trafia ostrzeżenie, żeby braku nie dało się przeoczyć na produkcji.",
        "brakInterakcji": "Ikona nie przyjmuje kursora ani skupienia i nie zmienia wyglądu — nie ma żadnego stanu. Klikalna ikona to przycisk ikonowy, osobna pozycja katalogu."
      },
      "a11y": {
        "rola": "img; przy dekoracyjna = true element nie ma roli",
        "czytnikEkranu": "Przy dekoracyjna = false ikona ma rolę img i aria-label z propu etykieta; przy true dostaje aria-hidden i wypada z odczytu, żeby nie dublować sąsiedniego napisu.",
        "klawiatura": "Ikona nie wchodzi w kolejność Tab i nie da się na niej zatrzymać — nie niesie akcji.",
        "kontrast": "Ikona znacząca (dekoracyjna = false) trzyma 3:1 wobec tła, na którym leży; ikona ozdobna temu progowi nie podlega."
      },
      "tokenConsumption": [
        "rdzen.rozmiar.ikona-maly",
        "rdzen.rozmiar.ikona-sredni",
        "rdzen.rozmiar.ikona-duzy",
        "rdzen.rozmiar.ikona-wielki",
        "rdzen.semantic.tekst-podstawowy"
      ]
    },
    "przepis": {
      "parts": [
        {
          "id": "root",
          "element": "icon",
          "iconName": "informacja",
          "bind": {
            "width": {
              "token": "rdzen.rozmiar.ikona-sredni"
            },
            "height": {
              "token": "rdzen.rozmiar.ikona-sredni"
            },
            "color": {
              "token": "rdzen.semantic.tekst-podstawowy"
            }
          }
        }
      ],
      "variants": {
        "rozmiar": {
          "maly": {
            "root": {
              "width": {
                "token": "rdzen.rozmiar.ikona-maly"
              },
              "height": {
                "token": "rdzen.rozmiar.ikona-maly"
              }
            }
          },
          "sredni": {
            "root": {
              "width": {
                "token": "rdzen.rozmiar.ikona-sredni"
              },
              "height": {
                "token": "rdzen.rozmiar.ikona-sredni"
              }
            }
          },
          "duzy": {
            "root": {
              "width": {
                "token": "rdzen.rozmiar.ikona-duzy"
              },
              "height": {
                "token": "rdzen.rozmiar.ikona-duzy"
              }
            }
          },
          "wielki": {
            "root": {
              "width": {
                "token": "rdzen.rozmiar.ikona-wielki"
              },
              "height": {
                "token": "rdzen.rozmiar.ikona-wielki"
              }
            }
          }
        }
      }
    }
  }
}
