Napraviti jednostavan sistem koji koristi izmišljena kompanija ETFBL_IP koja se bavi
iznajmljivanjem električnih automobila, bicikala i trotineta. Sistem se sastoji od nekoliko dijelova
koji su opisani u nastavku:
Spring Boot backend aplikacija i baza podataka
Kompanija ima na raspolaganju određen broj automobila za koje se čuvaju sljedeći podaci:
jedinstveni identifikator (ID - string), datum nabavke, cijena nabavke, proizvođač, model i opis.
Za električne bicikle čuvaju se sljedeći podaci: jedinstveni identifikator (ID - string), proizvođač,
model, cijena nabavke, domet sa jednim punjenjem (autonomija). Za električne trotinete čuvaju
se sljedeći podaci: jedinstveni identifikator (ID - string), proizvođač, model, cijena nabavke i
maksimalna brzina. Sva prevozna sredstva se mogu pokvariti, pri čemu se evidentira razlog
kvara (opis) i datum i vrijeme. Podatke je potrebno tako organizovati da se u bilo kojem trenutku
mogu dobiti informacije da li je prevozno sredstvo pokvareno ili iznajmljeno. ID vrijednosti koje
su tekstualnog tipa se definišu ručno i nisu isti kao ID PK polja koja se mogu definisati u
tabelama u bazi podataka. Sva prevozna sredstva treba da imaju sliku. Za proizvođače se
čuvaju naziv, država, adresa i kontakt podaci (telefon, fax, email).
Osnovni posao kompanije je iznajmljivanje prevoznih sredstava. Prilikom iznajmljivanja
evidentiraju se datum i vrijeme iznajmljivanja, korisnik, trenutna lokacija gdje je prevozno
sredstvo preuzeto, lokacija gdje se prevozno sredstvo ostavlja nakon korišćenja i trajanje
korišćenja. Lokacije čuvati kao koordinate. Prilikom iznajmljivanja automobila potrebno je
dostaviti identifikacioni dokument (pasoš za strane državljane i ličnu kartu za domaće) i vozačku
dozvolu (broj). Na osnovu ovih podataka generiše se račun za plaćanje koji se dostavlja
korisnicima kao PDF fajl u aplikaciji.
Korisnici aplikacije mogu biti zaposleni kompanije (administratori, operateri, menadžment) ili
klijenti (oni koji iznajmljuju prevozna sredstva). Klijenti moraju otvoriti nalog na sistemu i
dostaviti ime, prezime, broj lične karte, email, broj telefona, a mogu imati avatar sliku. Osim
toga, čuvati i dodatne podatke koji su potrebni da se iznajme prevozna sredstva. Zaposleni
takođe imaju profile za koje se čuvaju ime, prezime, radno mjesto (kao uloga). Svi korisnici se
prijavljuju na sistem unosom korisničkog imena i loznike.
U sistemu je moguće praviti objave i promocije kao oblik marketinških aktivnosti.
Funkcionalnosti SpringBoot aplikacije koje će se koristiti u drugim aplikacijama implementirati
kao RESTful servise. Napraviti RSS feed koji vraća informacije o promocijama i objavama.
Dozvoljeno je dodati podatke koji su korisni za procese rada sistema, a nisu definisani u tekstu
zadatka.
Aplikacija za zaposlene
Ovo je centralna aplikacija sistema koju koriste zaposleni. Aplikacija treba imati stranicu za
prijavu na sistem, a u zavisnosti od uloge koju zaposleni ima prikazivaće se opcije.
Administratori imaju pristup sljedećim stranicama:
- Stranica za upravljanje prevoznim sredstvima gdje se razvrstano po vrstama prevoznih
sredstava (tabovi ili odvojene stranice, segmenti,...), tabelarno prikazuju svi podaci. Na
ovom dijelu aplikacije moguće je započeti kreiranje novog prevoznog sredstva ili obrisati
izabrano prevozno sredstvo. Osim toga, na ovoj stranici dostupna je opcija za upload
CSV fajla u kojem se nalaze podaci o prevoznom sredstvu. Format fajla definisati
samostalno.
- Stranica za pregled detalja gdje se prikazuju svi podaci o jednom prevoznom sredstvu.
Osim osnovnih informacija, prikazuju se svi kvarovi koji se mogu dodati ili obrisati, i sva
iznajmljivanja tog prevoznog sredstva.
- Stranica za definisanje proizvođača (CRUD).
- Stranica za upravljanje korisnicima gdje se prikazuju svi korisnici (klijenti i zaposleni,
odvojeno). Klijentski nalozi se mogu blokirati ili odblokirati, a za naloge zaposlenih
omogućiti CRUD operacije.
Operateri imaju pristup sljedećim stranicama:
- Stranica za pregled iznajmljivanja - samo prikaz informacija.
- Stranica za pregled prevoznih sredstava na mapi (mapu implementirati kao matricu ili
pomoću neke biblioteke kao realnu mapu).
- Stranica za pregled klijenata uz opcije blokiranja ili odblokiranja naloga.
- Stranica za unos kvara prevoznog sredstva.
Menadžeri imaju pristup sljedećim stranicama:
- Sve stranice administratora.
- Sve stranice operatera.
- Stranica za pregled statistke (grafikon ukupnog prihoda po danima za izabrani mjesec,
broj kvarova po prevoznom sredstvu, grafikon ukupnih prihoda po vrsti prevoznog
sredstva). Za izradu grafikona dozvoljeno je koristiti gotove biblioteke.
- Stranica za definisanje cijena iznajmljivanja.
Na svim stranicama za pregled podataka potrebno je omogućiti pretragu bar po vrijednostima iz
jedne kolone. Napraviti straničenje (paginaciju) tabela, ili virtual scroll za liste.
Aplikacija mora imati uniforman izgled svih stranica. Za izradu koristiti Angular ili React.
Dozvoljeno je koristiti gotove biblioteke kao što je Bootstrap ili Material.
Aplikacija za klijente
Na početnoj stranici nalazi se forma za prijavu. Ako je prijava uspješna otvara se stranica na
kojoj se nalaze 4 opcije: iznajmljivanje trotineta, iznamljivanje bicikla, iznajmljivanje automobila i
prikaz profila. Kada se izabere opcija za iznajmljivanje, korisnik unosi potrebne podatke
(detekcija lokacije - ručno ili automatski), izbor prevoznog sredstva, plaćanje (definisanje platne
kartice i potvrda plaćanja) i započinje se vožnja. Tokom vožnje prikazuje se ekran na kojem se
nalazi iznos za plaćanje i vrijeme vožnje (sat) i opcija za završetak vožnje. Na profilnoj stranici
klijent može da mijenja lozinku, deaktivira nalog i pregleda sva svoja iznajmljivanja.
Implementacija aplikacije mora biti pomoću JSP M2. Ova aplikacija ne može koristiti RESTful
servise Spring Boot aplikacije. Dozvoljeno je korištenje gotovih biblioteka za dizajn korisničkog
interfejsa. Izgled aplikacije mora biti primarno prilagođen uređajima sa malim ekranima.
Aplikacija za kreiranje promocija
Pristup ovoj aplikaciji imaju samo menadžeri. Ako je prijava uspješna otvara se stranica na kojoj
se mogu pregledati sve kreirane promocije i objave, a mogu se pretražiti po sadržaju. Omogućiti
kreiranje nove objave (naslov, sadržaj) i promocije (naslov, opis, datum trajanja).
Aplikaciju implementirati upotrebom JSP-a.
Napomene:


● Interfejs prema korisniku treba da bude organizovan na jednoobrazan način tj., sve
stranice treba da imaju sličan izgled i intuitivne kontrole i prikaz.
● Svaki vid serverske validacije potrebno je da bude što efikasnije realizovan. Obavezno
napraviti klijentsku validaciju.
● Nije dozvoljeno koristiti stored procedure, funkcije i okidače (triggere). Dakle, baza
podataka ne smije imati bilo kakvu logiku osim definisanih tabela i ograničenja koja važe
među njima.

