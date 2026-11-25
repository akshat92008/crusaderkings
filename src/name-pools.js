/**
 * Deterministic unique cultural name & house allocation for Crown of Nations.
 *
 * Uses a per-game-object WeakMap seeded from existing living & historical
 * characters so full names never repeat across rulers, nobles, independent
 * polities, commanders, or prelates — while keeping serialized game state clean.
 */

const NAME_POOLS = {
 'Western Europe': {
  male: [
   'Alaric','Aldous','Alfonso','Anselm','Archibald','Arnold','Arthur','Aubrey','Baldwin','Bartholomew',
   'Benedict','Berengar','Bernard','Bertram','Bram','Casimir','Cedric','Charles','Clarence','Clement',
   'Conrad','Cuthbert','Dominic','Duncan','Edgar','Edmund','Edward','Edwin','Egbert','Elias',
   'Emeric','Enguerrand','Eustace','Everard','Ferdinand','Folke','Francis','Frederick','Fulke','Gareth',
   'Geoffrey','Gerard','Gervase','Gideon','Gilbert','Giles','Godfrey','Gregory','Guy','Harold',
   'Henry','Herbert','Herman','Hugh','Humphrey','Ivo','Jasper','Jerome','John','Josselin',
   'Julian','Kenneth','Lambert','Laurence','Leofric','Leopold','Lionel','Lothair','Louis','Lucian',
   'Malcolm','Martin','Matthew','Maurice','Miles','Nicholas','Nigel','Norman','Oliver','Osbert',
   'Oswald','Otto','Owen','Percival','Peter','Philip','Ralph','Randolph','Raymond','Reginald',
   'Reynard','Richard','Robert','Roderick','Roger','Roland','Rudolf','Rupert','Sebastian','Simon',
   'Stephen','Theobald','Theodoric','Thomas','Tristan','Ulric','Valerian','Victor','Walter','Werner',
   'Wilfred','William','Wulfric'
  ],
  female: [
   'Adelaide','Adeline','Agatha','Agnes','Aileen','Alianor','Alice','Alis','Amabel','Amelia',
   'Amice','Anastasia','Avelina','Avice','Beatrice','Berengaria','Blanche','Bridget','Brigid','Camille',
   'Catherine','Cecilia','Celeste','Charlotte','Christiana','Clara','Clarice','Clemence','Constance','Cordelia',
   'Damaris','Denise','Dorothea','Edith','Eleanor','Elena','Elfrida','Elisabeth','Eloise','Emeline',
   'Emma','Ermengarde','Ethel','Euphemia','Eva','Evelyn','Felicia','Florence','Frances','Frederica',
   'Genevieve','Gertrude','Gisela','Godiva','Grace','Guinevere','Gwendolen','Hawise','Helena','Heloise',
   'Henrietta','Hildegard','Honora','Ida','Imogen','Irmgard','Isabel','Isabella','Isolde','Jacquetta',
   'Jane','Joan','Johanna','Judith','Juliana','Katherine','Lavinia','Letitia','Lillian','Louisa',
   'Lucia','Lucretia','Mabel','Madeleine','Margaret','Margery','Marian','Martha','Matilda','Maud',
   'Melisende','Millicent','Miriam','Muriel','Nicola','Odette','Olivia','Petronilla','Philippa','Prudence',
   'Rohese','Rosamund','Rose','Sabina','Sibyl','Sophia','Susanna','Sybil','Theodora','Thomasin',
   'Ursula','Vivian','Winifred','Yolande'
  ],
  surnames: [
   'Ashworth','Beaumont','Beresford','Blackwood','Boleyn','Bourchier','Brabant','Bramwell','Calder','Castell',
   'Chaucer','Clermont','Courtenay','Cromwell','Davenport','Delacroix','Dunstan','Effingham','Fairfax','Fauconberg',
   'Ferrers','FitzAlan','FitzRoy','Fleming','Fournier','Gascoyne','Gloucester','Gower','Greycliff','Harcourt',
   'Hastings','Hauteclaire','Holbrook','Howard','Lancaster','Langley','Latimer','Lovelace','Lusignan','Mandeville',
   'Manners','Marchand','Marmion','Montague','Montfort','Morel','Mortimer','Mowbray','Neville','Northumberland',
   'Pembroke','Plantagenet','Pomeroy','Radcliffe','Ravenscroft','Redvers','Rochefort','Rousseau','St. Clair','Salisbury',
   'Savoy','Scrope','Seymour','Stafford','Stanley','Stanhope','Talbot','Tudor','Valence','Varennes',
   'Vere','Vernon','Villeroy','Wakefield','Waldegrave','Warwick','Wentworth','Westmoreland','Willoughby','Woodville'
  ],
  titles: ['Sir','Lord','Marshal','Baron','Capt.']
 },
 'Nordic & Baltic': {
  male: [
   'Ake','Alvar','Arne','Asbjorn','Asger','Askell','Astrad','Atle','Audun','Axel',
   'Balder','Birger','Bjorn','Bodil','Botulf','Brandr','Canute','Dag','Egil','Einar',
   'Eirik','Emund','Erling','Esben','Eystein','Fasti','Finn','Folke','Freyr','Frode',
   'Gaut','Geir','Gisli','Gorm','Grim','Gudmund','Gunnar','Gustav','Hakon','Halfdan',
   'Halldor','Halvard','Harald','Havelok','Helge','Hemming','Henrik','Hjalmar','Holmger','Hrolf',
   'Ingemar','Ingolf','Ingvar','Ivar','Jarl','Jorgen','Kari','Karl','Ketil','Kjell',
   'Knut','Kolbein','Lars','Leif','Magnus','Mikkel','Niels','Odd','Olaf','Olav',
   'Orm','Osvald','Ove','Ragnvald','Rolf','Rune','Sigurd','Sigvald','Skule','Snorri',
   'Soren','Sten','Stig','Sturla','Sven','Svend','Thorbjorn','Thorfinn','Thorgeir','Thorkell',
   'Thorstein','Torben','Tore','Torsten','Tryggve','Ulf','Valdemar','Viggo','Vilhjalm','Yngvar'
  ],
  female: [
   'Aasa','Alfhild','Alva','Asa','Aslaug','Asta','Astrid','Aud','Bergljot','Birgitta',
   'Bodil','Borghild','Brynhild','Dagmar','Dagny','Disa','Eir','Elin','Elisabet','Embla',
   'Estrid','Freja','Frida','Gerd','Gerda','Gyda','Gudrid','Gudrun','Gunhild','Gunvor',
   'Haldis','Hallbera','Hallgerd','Hedvig','Helga','Herdis','Hild','Hildegunn','Hjordis','Holmfrid',
   'Ida','Ingeborg','Ingegerd','Ingrid','Jorunn','Kari','Katrin','Kirsten','Liv','Magnhild',
   'Margareta','Maren','Marit','Nanna','Oddny','Olof','Ragna','Ragnfrid','Ragnhild','Ranveig',
   'Revna','Rigmor','Runa','Saga','Sidsel','Signe','Sigrid','Sigrun','Siri','Solveig',
   'Steinvor','Sunniva','Svanhild','Thora','Thordis','Thorunn','Thyra','Tora','Tove','Turid',
   'Ulfhild','Unnr','Valdis','Vibeke','Vigdis','Ylva','Yngvild','Yrja'
  ],
  surnames: [
   'Alvsson','Arnesson','Asgrimsson','Bielke','Birkebeiner','Bjornsson','Brahe','Dahl','Eiriksson','Ekstrom',
   'Engelbrekt','Falk','Freyrsson','Galen','Gislason','Gripsholm','Gudmundsson','Gunnarsson','Gyldenstjerne','Hakonsson',
   'Halldorsson','Halvorsen','Haraldsson','Hauksson','Huitfeldt','Ingvarsson','Ivarsson','Jarlsson','Knutsson','Krag',
   'Lillehammer','Lindqvist','Magnusson','Munk','Nielsson','Norberg','Olavsson','Oxenstierna','Ragnvaldsson','Rosenkrantz',
   'Sigurdsson','Skjoldung','Smed','Solberg','Sparre','Sture','Svendsson','Thorgilsson','Trolle','Ulfsson',
   'Vasa','Vestergaard','Vik','Vinter','Yngling'
  ],
  titles: ['Jarl','Huskarl','Hersir','Marshal','Skipper']
 },
 'Mediterranean': {
  male: [
   'Achille','Adolfo','Agostino','Alberto','Alessandro','Alfonso','Alvaro','Amadeo','Andrea','Angelo',
   'Antonio','Arnaldo','Bartolomeo','Bastiano','Benedetto','Bernardo','Bertran','Biagio','Bonifacio','Calogero',
   'Camillo','Carlo','Cesare','Ciro','Cosimo','Cristoforo','Dante','Dario','Diego','Domenico',
   'Donato','Edoardo','Emanuele','Emilio','Enrico','Enzo','Ettore','Eugenio','Fabrizio','Federico',
   'Felipe','Ferdinando','Ferran','Filippo','Flavio','Francesco','Gabriele','Galeazzo','Gaspare','Gastone',
   'Giacomo','Gianluca','Giordano','Giorgio','Giovanni','Girolamo','Giulio','Gonzalo','Gregorio','Guglielmo',
   'Guido','Guillermo','Inigo','Jacopo','Jaime','Juan','Lamberto','Lazzaro','Leonardo','Leone',
   'Lorenzo','Luca','Luciano','Ludovico','Luigi','Manfredi','Marco','Mariano','Martino','Matteo',
   'Maurizio','Niccolo','Nicola','Oddone','Orfeo','Orlando','Ottavio','Paolo','Pasquale','Pedro',
   'Piero','Pietro','Raffaello','Ramiro','Ranieri','Renato','Riccardo','Roberto','Rodrigo','Ruggiero',
   'Salvatore','Sancho','Sandro','Sebastiano','Sergio','Silvio','Simone','Stefano','Tancredi','Tommaso',
   'Uberto','Ugo','Umberto','Valerio','Vincenzo','Vittorio'
  ],
  female: [
   'Adelasia','Agnese','Alda','Alessandra','Allegra','Amalia','Angelica','Anna','Antonella','Beatrice',
   'Benedetta','Bianca','Bona','Camilla','Carlotta','Caterina','Cecilia','Chiara','Clara','Clarissa',
   'Clemenza','Clotilde','Colomba','Concetta','Costanza','Cristina','Dalila','Diana','Domitilla','Donata',
   'Donatella','Dulce','Elena','Eleonora','Elisa','Elisabetta','Emilia','Enrica','Ermelinda','Estefania',
   'Eugenia','Fabiola','Fausta','Federica','Fiammetta','Filippa','Fiorenza','Flavia','Francesca','Gaia',
   'Gemma','Ginevra','Giovanna','Giulia','Giuliana','Giuseppa','Grazia','Ines','Irene','Isabella',
   'Jimena','Laura','Lavinia','Leonor','Letizia','Lidia','Livia','Lorenza','Lucia','Lucrezia',
   'Ludovica','Luisa','Maddalena','Mafalda','Margherita','Maria','Marianna','Marina','Marta','Matilde',
   'Monica','Natalia','Nerina','Nicoletta','Noemi','Olimpia','Orsola','Ottavia','Paola','Patrizia',
   'Pia','Prisca','Rachele','Raffaella','Regina','Riccarda','Rosa','Rosalia','Sabina','Serafina',
   'Silvia','Simona','Sofia','Teresa','Tiziana','Violante','Vittoria','Ximena'
  ],
  surnames: [
   'Acciaioli','Alberti','Aldobrandeschi','Altavilla','Alvarez','Aragon','Barbarigo','Bardi','Bentivoglio','Borgia',
   'Braganza','Caetani','Calatrava','Candiano','Caracciolo','Carrara','Cavalcanti','Colonna','Contarini','Cornaro',
   'Corsini','Dandolo','Doria','Este','Farnese','Fieschi','Foscari','Gherardesca','Giustiniani','Gonzaga',
   'Grimaldi','Guzman','Jimenez','Lando','Lara','Loredan','Malaspina','Malatesta','Medici','Mendoza',
   'Mocenigo','Montefeltro','Morosini','Navarro','Ordelaffi','Orsini','Pallavicini','Pazzi','Peruzzi','Piccolomini',
   'Polenta','Querini','Riario','Rovere','Sanudo','Savelli','Sforza','Spinola','Strozzi','Toledo',
   'Trastamara','Valier','Venier','Visconti','Zeno'
  ],
  titles: ['Condottiere','Signor','Don','Captain','Marshal']
 },
 'Slavic & Steppe': {
  male: [
   'Aladar','Aleksander','Aleksei','Andrei','Anatol','Arpad','Batu','Bela','Bogdan','Boleslav',
   'Boris','Branislav','Casimir','Cezary','Danilo','Darius','Dmitri','Dobromil','Dragomir','Dusan',
   'Fedor','Fyodor','Gavril','Gediminas','Georgi','Gleb','Grigor','Igor','Ilia','Ivan',
   'Iziaslav','Janusz','Jaromir','Jaroslav','Kaloyan','Kazimierz','Kirill','Klemens','Konstantin','Krasimir',
   'Ladislav','Lazar','Leszek','Lev','Lubomir','Lukas','Marek','Matvei','Mieszko','Mikolaj',
   'Milan','Milos','Miroslav','Mstislav','Nazar','Nikita','Nikolai','Oleg','Pavel','Petr',
   'Piotr','Przemysl','Radovan','Radoslav','Ratibor','Roman','Rostislav','Ruslan','Sava','Semen',
   'Sergei','Simeon','Slavko','Stanislav','Stefan','Stoyan','Sviatopolk','Sviatoslav','Tadeusz','Taras',
   'Timofei','Todor','Toma','Vadim','Valentin','Vasil','Vasily','Venceslas','Viktor','Vitaly',
   'Vladimir','Vladislav','Vlastimil','Vojtech','Vsevolod','Waclaw','Wladyslaw','Yaropolk','Yaroslav','Zygmunt'
  ],
  female: [
   'Agata','Agnieszka','Aleksandra','Alena','Anastasia','Anfisa','Anna','Antonina','Bela','Bogdana',
   'Boleslava','Bozena','Bronislava','Danica','Daria','Dobrawa','Dobroslava','Dragana','Elena','Elzbieta',
   'Eufemia','Evdokia','Evgenia','Fedorovna','Feodosia','Galina','Gorislava','Hanna','Helena','Irena',
   'Irina','Ivana','Jadwiga','Jana','Jaromira','Jaroslava','Jelena','Jolanta','Kalina','Kamila',
   'Karolina','Katarina','Katarzyna','Kinga','Klara','Kornelia','Ksenia','Lada','Larisa','Lidia',
   'Lubava','Lucia','Ludmila','Lyubov','Magdalena','Malina','Maria','Marina','Marta','Marzena',
   'Milena','Milica','Miroslava','Nadezhda','Natalia','Nevena','Nina','Oksana','Olga','Olena',
   'Paraskeva','Petra','Polina','Predslava','Przemyslawa','Radmila','Radoslava','Rogneda','Rostislava','Rozalia',
   'Ruslana','Sbyslava','Slava','Sofia','Stanislava','Stefania','Svetlana','Tamara','Tatiana','Teodora',
   'Ulyana','Vasilisa','Vera','Veronika','Vlasta','Wanda','Zdislava','Zinaida','Zlata','Zofia','Zorya'
  ],
  surnames: [
   'Arpad','Batory','Boyar','Chernigov','Czartoryski','Dmitriev','Dolgoruky','Dragases','Draskovic','Galich',
   'Gedimin','Giedraitis','Glinka','Godunov','Golitsyn','Gorjanski','Hunyadi','Jagello','Kalinowski','Karamzin',
   'Karpati','Kievsky','Kobilic','Kosciuszko','Koval','Krasinski','Kurbsky','Lazarevic','Lubomirski','Milosz',
   'Monomakh','Morozov','Nemanja','Novgorod','Obolensky','Olgerd','Olszanski','Orlov','Ostrogski','Piast',
   'Potocki','Premyslid','Prokofiev','Radziwill','Romanov','Rurik','Sapieha','Shuysky','Sobieski','Streltsy',
   'Suvorov','Tarnovski','Tver','Vasiliev','Vladimirsky','Volkonsky','Voronov','Wisniowiecki','Zamoyski','Zapolya'
  ],
  titles: ['Voivode','Boyar','Hetman','Prince','Marshal']
 },
 Asia: {
  male: [
   'Abbas','Akbar','Akira','Alauddin','Alptegin','Ananda','Arjun','Arslan','Ashoka','Aziz',
   'Babur','Bahram','Baji','Balaji','Baibars','Chandra','Cheng','Daichi','Dara','Devraj',
   'Farhad','Farid','Firoz','Gautam','Ghazi','Govind','Habib','Haider','Hakim','Hamza',
   'Harish','Harsha','Haruki','Hasan','Hideaki','Hidetora','Hiroshi','Humayun','Husein','Ibrahim',
   'Iltutmish','Imad','Iskandar','Ismail','Jafar','Jahan','Jai','Jalal','Jamshed','Jian',
   'Jin','Kaito','Kamal','Karim','Kazuo','Kenji','Khalid','Khosrow','Kiran','Krishna',
   'Kublai','Lakshman','Liang','Madhav','Mahmud','Malik','Manmohan','Mansur','Masoud','Meiji',
   'Minoru','Mirza','Mohan','Murad','Mustafa','Nadir','Nagarjun','Naoki','Narayan','Nasir',
   'Noboru','Nur','Omar','Osman','Parvez','Pratap','Prithvi','Qasim','Qutb','Raghav',
   'Rajendra','Ranjit','Rashid','Rohan','Rostam','Ryu','Saad','Sadiq','Saladin','Salim',
   'Samar','Sanjay','Selim','Shahrukh','Sher','Shingen','Shinji','Shivaji','Siddharth','Sikandar',
   'Suleiman','Surya','Takeda','Tariq','Tatsuo','Timur','Tughril','Uday','Umar','Vikram',
   'Wei','Xiao','Yash','Yasuo','Yoritomo','Yuan','Yusuf','Zafar','Zahir','Zayd','Zhi'
  ],
  female: [
   'Aarti','Aasha','Aiko','Aisha','Akane','Akira','Alia','Amina','Amrita','Ananya',
   'Anika','Anjali','Anju','Anuradha','Aruna','Asiya','Asma','Ayaka','Ayako','Azadeh',
   'Banu','Chandni','Chandra','Chie','Chiyo','Dalal','Deepa','Devi','Divya','Dunya',
   'Emi','Etsuko','Farah','Farida','Fatima','Fawzia','Firoza','Fumiko','Gauri','Gayatri',
   'Geeta','Gulnar','Habiba','Hafsa','Halima','Hana','Hanako','Haruka','Harumi','Hina',
   'Huma','Indira','Jahanara','Jamila','Jaya','Kajal','Kalpana','Kamala','Kanika','Kaori',
   'Karima','Kasumi','Kavita','Khadija','Kiran','Keiko','Kumiko','Laila','Lakshmi','Laleh',
   'Lata','Latifa','Layla','Leila','Li','Lin','Lina','Madhavi','Mahbuba','Mahin',
   'Mai','Mala','Malika','Manisha','Mariam','Mayumi','Meera','Meher','Mei','Mihoko',
   'Mina','Mirabai','Misaki','Miyuki','Mohini','Mumtaz','Munira','Nadia','Nadine','Nafisa',
   'Naila','Nalini','Namrata','Nandini','Naomi','Nargis','Nasrin','Natsumi','Neela','Neha',
   'Nidhi','Niloufar','Nisha','Noor','Noriko','Nur','Padma','Parvati','Priya','Purnima',
   'Qamar','Rabia','Radha','Rani','Rashida','Razia','Rekha','Ren','Ritu','Rohini',
   'Roshni','Rukhsar','Rumi','Saba','Sabina','Sadia','Safiya','Sakura','Salma','Samira',
   'Sana','Sandhya','Sangeeta','Sarita','Satsuki','Seema','Shabnam','Shahnaz','Shakuntala','Shalini',
   'Shanti','Shirin','Shizuka','Sita','Sneha','Sonia','Soraya','Suhaila','Sulochana','Sumiko',
   'Sunita','Surya','Tara','Tarana','Tomoko','Uma','Urmila','Usha','Vandana','Vasudha',
   'Vidya','Wei','Xin','Yael','Yamini','Yasmin','Yoko','Yuki','Yumi','Zahra','Zainab','Zarina','Zoya'
  ],
  surnames: [
   'al-Mansur','al-Rashid','al-Din','al-Mulk','al-Nasser','al-Kamil','al-Zahir','al-Aziz','Ashikaga','Babar',
   'Barlas','Beg','Bhonsle','Chauhan','Chola','Date','Deccan','Farooqi','Fujiwara','Ghaznavi',
   'Ghori','Gupta','Hashemi','Hojo','Hosseini','Ibn Sina','Jahan','Jat','Kachwaha','Karimi',
   'Kato','Khalji','Khan','Khatri','Khosravi','Koyama','Lodi','Maurya','Minamoto','Mirza',
   'Mori','Mughal','Nizam','Noor','Oda','Pahlavi','Pala','Pallava','Pandya','Peshwa',
   'Qajar','Qureshi','Rathore','Safavid','Sakai','Sasan','Seljuk','Sen','Shah','Shimazu',
   'Shirazi','Shogun','Sindhia','Solanki','Suri','Taira','Takeda','Tang','Timurid','Tokugawa',
   'Tughlaq','Uesugi','Varma','Yadav','Yamamoto','Zaman','Zhao','Zhu'
  ],
  titles: ['Emir','Bey','Sardar','General','Commander']
 },
 Africa: {
  male: [
   'Abasi','Abbas','Abdallah','Abubakar','Adama','Ade','Ademola','Adisa','Afolabi','Agyeman',
   'Ahmadu','Akil','Akins','Akintunde','Akwasi','Alieu','Amadi','Amara','Amare','Aminu',
   'Amon','Anwar','Asante','Ashraf','Assefa','Atiku','Ayodele','Azikiwe','Babakar','Babatunde',
   'Bakari','Bamba','Bamidele','Banda','Bangoura','Bello','Berhane','Biniam','Boateng','Boubacar',
   'Chibuzo','Chidi','Chidubem','Chike','Chinedu','Chukwuma','Dakarai','Danladi','Darius','Dauda',
   'Dawit','Demba','Diallo','Dike','Diop','Djibril','Dumisani','Ebo','Ekon','Emeka',
   'Enyinnaya','Eshe','Eskinder','Fadl','Faraji','Femi','Fisseha','Folami','Folarin','Gamba',
   'Garba','Gideon','Girma','Goma','Gumede','Habib','Haile','Hakeem','Halim','Hamidi',
   'Haruna','Hassan','Ibrahim','Idris','Ifeanyi','Igwe','Ikenna','Imani','Ismaila','Issa',
   'Jabari','Jafari','Jamal','Jelani','Jide','Jomo','Juma','Kabir','Kagiso','Kalu',
   'Kamau','Kambui','Kanu','Karim','Kasim','Kato','Kayode','Kelechi','Kemboi','Khalfani',
   'Khari','Kibwe','Kofi','Kojo','Kwabena','Kwame','Kwesi','Lamine','Lekan','Luthuli',
   'Madu','Mahamat','Makonnen','Malik','Mandla','Mansa','Masamba','Masud','Matias','Mekonnen',
   'Mensah','Mhlanga','Modibo','Moussa','Mubarak','Mugisha','Musa','Mwangi','Nabil','Nasser',
   'Nnamdi','Nsia','Nuru','Obasi','Oba','Obinna','Ochieng','Odinga','Ojo','Okeke',
   'Okonkwo','Olu','Olufemi','Oluwaseun','Omari','Osei','Osman','Othman','Oumar','Ousmane',
   'Rasheed','Roho','Sadio','Said','Saka','Sani','Sankara','Sekou','Seyi','Shaka',
   'Sibanda','Simba','Solomon','Suleiman','Sundiata','Tadesse','Tafari','Taiwo','Tamrat','Tarik',
   'Tau','Tendai','Tewodros','Thabo','Toure','Tunde','Uche','Umaru','Wanjiru','Wekesa',
   'Yao','Yaw','Yohannes','Youssef','Zaki','Zayyad','Zedekiah','Zola','Zuberi','Zuri'
  ],
  female: [
   'Abebi','Abeba','Abigail','Abiola','Adaeze','Adanna','Adebisi','Adesuwa','Adhiambo','Adisa',
   'Afia','Afolabi','Afua','Aisha','Aissatou','Akilah','Akosua','Akua','Alaba','Alima',
   'Almaz','Amaka','Amina','Aminata','Amira','Anika','Anisa','Asa','Asantewaa','Ashanti',
   'Asma','Aster','Atinuke','Awa','Ayo','Ayodele','Aziza','Bahati','Bamidele','Bayan',
   'Berenice','Bethlehem','Binta','Bisrat','Bolanle','Bosede','Candace','Chidinma','Chika','Chinelo',
   'Chinyere','Chioma','Dada','Dalia','Dalila','Damilola','Danai','Deka','Desta','Dikeledi',
   'Diop','Ebele','Efe','Eka','Ekua','Elikem','Esi','Eshe','Fadila','Faiza',
   'Fanta','Farah','Fatima','Fatou','Folasade','Foluke','Fumnanya','Funke','Gamba','Genet',
   'Habiba','Hadia','Hadiza','Halima','Hamida','Hasina','Hawa','Ife','Ifeoma','Imani',
   'Inaya','Isoke','Itoro','Iyabo','Jamila','Jendayi','Juba','Kadiatou','Kagiso','Kalifa',
   'Kambili','Kamila','Karima','Kefilwe','Kelechi','Kenisha','Khadija','Khalfani','Kioni','Kudirat',
   'Latifa','Lela','Lillian','Lulu','Luwam','Makeda','Makena','Malika','Mariama','Marjani',
   'Masika','Mawusi','Mekdes','Menen','Mirembe','Monifa','Muna','Muthoni','Nadia','Nafisa',
   'Naila','Nakato','Nala','Nandi','Nneka','Nomalanga','Nomsa','Nora','Nuru',
   'Nyah','Nyanza','Nyasha','Nzinga','Oba','Obioma','Ogechi','Olanna','Oluwatoyin','Omolara',
   'Onyeka','Osas','Rabi','Rahma','Ramla','Rashida','Roda','Roha','Rukayat','Sadia',
   'Safiya','Salama','Salima','Samira','Sanaa','Sanura','Sekai','Selam','Selamawit','Sena',
   'Shani','Sora','Subira','Tala','Tamasha','Tariro','Thandi','Tiwa','Tola','Uchechi',
   'Uju','Umi','Unathi','Wambui','Wangari','Wanjiku','Winta','Yaa','Yewande','Yohanna',
   'Zahra','Zainab','Zakiya','Zalika','Zaria','Zeinab','Zola','Zulekha','Zuri'
  ],
  surnames: [
   'Abubakar','Achebe','Adeyemi','Agbaje','Agyei','Ahmadu','Ake','Al-Kanemi','Amadou','Appiah',
   'Asante','Ashanti','Askia','Awolowo','Ba','Bah','Banda','Bangura','Bello','Berhane',
   'Boateng','Camara','Cisse','Coulibaly','Dakar','Diallo','Diarra','Diawara','Diop','Dlamini',
   'Dramani','Eze','Fall','Fofana','Girma','Guei','Haile','Haidara','Harbi','Hassan',
   'Ibrahim','Jalloh','Kagame','Kamara','Kane','Keita','Kenyatta','Khama','Khatib','Khumalo',
   'Kone','Kourouma','Kufuor','Kumalo','Lamine','Luthuli','Maiga','Makonnen','Mandela','Mansa',
   'Mensah','Mkandawire','Mobutu','Mokgadi','Moussa','Mugabe','Musa','Mwangi','Ndiaye','Ndlovu',
   'Nkomo','Nkrumah','Nyerere','Obasanjo','Odinga','Okafor','Okonkwo','Okoro','Osei','Ouattara',
   'Sankara','Sanogo','Sarr','Savimbi','Seck','Selassie','Senghor','Sidibe','Sow','Sylla',
   'Tafari','Tamba','Toure','Traore','Tshisekedi','Wambugu','Yoruba','Zayd','Zewde','Zulu'
  ],
  titles: ['Farba','Ras','Emir','Commander','Captain']
 },
 'North America': {
  male: [
   'Acamapichtli','Acolmiztli','Ahuitzotl','Aketzali','Amoxtli','Atahualpa','Axayacatl','Cacama','Calmecac','Chicahua',
   'Chimalpopoca','Cipactli','Citlal','Coatl','Cozahtli','Cuauhtemoc','Cuauhtli','Cuitlahuac','Ehecatl','Eloxochitl',
   'Hiawatha','Huemac','Huitzilihuitl','Huitzilopochtli','Icnoyotl','Ilhicamina','Itzcóatl','Itzel','Ixtli','Kaya',
   'Kukulkan','Mahpiya','Matlal','Maxtla','Mictlan','Moctezuma','Nahuatl','Nawat','Nezahualcoyotl','Nima',
   'Noche','Nopaltzin','Ocelotl','Ollin','Opochtli','Patli','Popoca','Quetzal','Quinatzin','Tecumseh',
   'Tecuani','Tenoch','Teotihuac','Tepiltzin','Texcoco','Tezcatl','Tizoc','Tlacaelel','Tlaloc','Tlalli',
   'Tlanextli','Tlatelol','Tochtli','Tonatiuh','Topiltzin','Tototl','Tzompantli','Xicotencatl','Xihuitl','Xipe',
   'Xochitl','Yaotl','Yolotl','Yopico','Zacatzin','Zolin'
  ],
  female: [
   'Acamapichtli','Aketzali','Alotl','Ameyalli','Anahuac','Atl','Atotoztli','Ayauhcihuatl','Cacama','Chalchiuitl',
   'Chicome','Chimalma','Cihuacoatl','Citlali','Citlalicue','Citlalli','Coatlicue','Coszcatl','Coyolxauhqui','Eloxochitl',
   'Eréndira','Etalpalli','Huixtocihuatl','Ichpochtli','Ilancueitl','Itzel','Itzpapalotl','Ixtaccihuatl','Iyari','Kaya',
   'Macuilxochitl','Malinali','Malintzin','Matlalcihuatl','Mayahuel','Meztli','Mictecacihuatl','Mixtli','Miztli','Nahuatl',
   'Nayeli','Nelli','Nenetl','Nima','Noche','Ocelotzin','Ollin','Oxomoco','Papantzin','Quetzalli',
   'Quiauhxochitl','Tecapantzin','Tecuichpoch','Teicuih','Telpochtli','Tenoch','Teoxihuitl','Teyacapan','Tlachinolli','Tlaco',
   'Tlacochcalcatl','Tlahuitl','Tlalli','Tlazolteotl','Tlexochitl','Tochtli','Toltecatl','Tonantzin','Tzitzitlini','Xilonen',
   'Xiloxochitl','Xiuhtlaltzin','Xiuhcoatl','Xochiquetzal','Xochitl','Yaotl','Yaretzi','Yolotli','Yoloxochitl','Zeltzin','Zyanya'
  ],
  surnames: [
   'Acalan','Alcohua','Anahuac','Atzcapotzalco','Azcapotz','Calpulli','Chalco','Chichimec','Cholula','Cempoala',
   'Coyoacan','Coyotepec','Culhua','Huastec','Huexotzinco','Ixtapalapa','Malinalco','Mixtec','Nahuatl','Oaxaca',
   'Otomi','Palenque','Pochteca','Purepecha','Quetzalcoatl','Tacuba','Tenochtitlan','Teotihuacan','Tepanec','Tetzcoco',
   'Tlacopan','Tlatelolco','Tlaxcala','Toltec','Totonac','Tula','Tzintzuntzan','Xaltocan','Xochimilco','Zapotec'
  ],
  titles: ['Tlacateccatl','Cuauhtli','War Chief','Captain','Warden']
 },
 'South America': {
  male: [
   'Amaru','Anka','Antay','Apu','Atahualpa','Atoc','Auca','Ayar','Capac','Chaska',
   'Chavin','Choque','Condor','Cori','Cusi','Guaman','Huaman','Huascar','Huayna','Illapa',
   'Inca','Inti','Karu','Killa','Kuntur','Lloque','Manco','Mayta','Ninan','Ollanta',
   'Pachacuti','Paucar','Puma','Quispe','Rimac','Rumi','Sairi','Sayri','Sinchi','Sullca',
   'Tahuantinsuyu','Titu','Topa','Tupac','Tupaq','Urco','Urpi','Viracocha','Wayna','Willaq',
   'Willka','Yahuar','Yupanqui','Zairi'
  ],
  female: [
   'Acclla','Alpa','Amancay','Anahuarque','Asarpay','Ayar','Cantu','Chaska','Chaskawi','Chimpu',
   'Choque','Chuqui','Cora','Cori','Coya','Curi','Cusi','Huaco','Huaman','Illari',
   'Inti','Kantu','Killa','Kori','Kuka','Kuntur','Kusi','Llanque','Mama','Micay',
   'Naira','Nayra','Nusta','Ocllo','Pacha','Pacsa','Pallpa','Puma','Qori','Quilla',
   'Quispe','Rahua','Rima','Rumi','Sairi','Sami','Sara','Sisa','Sumaq','Taki',
   'Tika','Urco','Urpi','Uyar','Wara','Wayra','Willka','Yaku','Yana','Yurak'
  ],
  surnames: [
   'Ancash','Antisuyu','Apurimac','Arequipa','Atacama','Ayacucho','Cajamarca','Chachapoya','Chanca','Chanchan',
   'Chimu','Chincha','Collasuyu','Condesuyu','Cusco','Huanuco','Huari','Inca','Jauja','Lima',
   'Lupaca','Moche','Nazca','Ollantay','Pachacamac','Paracas','Puno','Quito','Rumi','Sacsayhuaman',
   'Tahuantinsuyu','Tiwanaku','Tumbes','Vilcabamba','Wanka','Yauyos'
  ],
  titles: ['Apukispay','Sinchi','Curaca','Captain','Marshal']
 },
 Oceania: {
  male: [
   'Anaru','Ariki','Aroha','Ata','Eru','Haami','Haki','Hemi','Henare','Hohepa',
   'Hone','Hori','Ihaia','Iwikau','Kahurangi','Kauri','Kawana','Kereama','Kiri','Koa',
   'Koro','Kupe','Mana','Manaia','Manu','Marama','Matangi','Maui','Maunga','Moana',
   'Mokai','Ngakau','Ngaio','Ngapuhi','Nikau','Paora','Parata','Pita','Poata','Poutama',
   'Rangi','Ranginui','Raukawa','Rawiri','Rehua','Rewi','Riki','Rongo','Rua','Tahu',
   'Tama','Tamati','Tane','Tangaroa','Tawhiri','Te Ariki','Tiaki','Tane','Tipene','Toa',
   'Tu','Tui','Turi','Wai','Wiremu'
  ],
  female: [
   'Aaria','Aio','Amaia','Anahera','Aroha','Ataahua','Atawhai','Awhina','Hana','Hine',
   'Hinemoa','Hinerangi','Huia','Irihapeti','Kaea','Kahurangi','Kaia','Kiri','Kora','Kowhai',
   'Mahina','Maia','Makere','Manaia','Manawa','Marama','Marewa','Miriama','Moana','Moemoea',
   'Ngaio','Ngawai','Nia','Pania','Pare','Pounamu','Puawai','Rangi','Rangimarie','Raukura',
   'Rewa','Ripeka','Roimata','Rongo','Talia','Tama','Tia','Tiare','Tui','Wai',
   'Waimarie','Wairaka','Whina'
  ],
  surnames: [
   'Aotea','Aotearoa','Hawaiki','Kaha','Kahungunu','Kauri','Maniapoto','Ngāpuhi','Ngāi Tahu','Ōtautahi',
   'Pounamu','Raukawa','Rotorua','Tainui','Tākitimu','Tamaki','Tangaroa','Taranaki','Taupō','Te Arawa',
   'Te Atiawa','Te Ika','Te Waipounamu','Tokomaru','Tūhoe','Waikato','Wairarapa','Waitemata','Whanganui','Whangarei'
  ],
  titles: ['Rangatira','Ariki','Toa','Captain','Warden']
 },
};

const PAPAL_NAMES = [
 'Pope Nicholas V','Pope Callixtus III','Pope Pius II','Pope Paul II','Pope Sixtus IV',
 'Pope Innocent VIII','Pope Alexander VI','Pope Julius II','Pope Leo X','Pope Adrian VI',
 'Pope Clement VII','Pope Paul III','Pope Julius III','Pope Marcellus II','Pope Paul IV',
 'Pope Pius IV','Pope Pius V','Pope Gregory XIII','Pope Sixtus V','Pope Urban VII',
 'Pope Gregory XIV','Pope Innocent IX','Pope Clement VIII','Pope Leo XI','Pope Paul V'
];

const CARDINAL_GIVEN = [
 'Matteo','Lorenzo','Giuliano','Alfonso','Rodrigo','Ascanio','Francesco','Enea','Pietro','Giovanni',
 'Raffaele','Galeazzo','Domenico','Niccolo','Bartolomeo','Filippo','Cristoforo','Ludovico','Tommaso','Guillaume',
 'Jean','Pierre','Pedro','Juan','Ximenes','George','Thomas','Albrecht','Konrad','Kaspar'
];
const CARDINAL_SURNAMES = [
 'Orsini','Colonna','Borgia','Piccolomini','Della Rovere','Medici','Sforza','Barbo','Cibo','Carafa',
 'Estouteville','Castellesi','Riario','Farnese','Grimani','Gonzaga','Visconti','Pallavicini','Mendoza','Tavera',
 'Bainbridge','Wolsey','Morton','Albergati','Capranica','Cesarini','Bessarion','Torquemada','Condulmer','Zeno'
];

const REGISTRY_MAP = new WeakMap();

export function hashNameSeed(str) {
 let h = 2166136261 >>> 0;
 const s = String(str || '');
 for (let i = 0; i < s.length; i++) {
  h ^= s.charCodeAt(i);
  h = Math.imul(h, 16777619) >>> 0;
 }
 return h >>> 0;
}

export function resolvePoolKey(continent, culture = '', faith = '', realmId = '') {
 const c = String(culture || '').toLowerCase();
 const r = String(realmId || '').toLowerCase();
 const f = String(faith || '').toLowerCase();
 if (c.includes('norse') || c.includes('nordic') || c.includes('baltic') || r === 'denmark' || r === 'sweden' || r === 'norway') return 'Nordic & Baltic';
 if (c.includes('slav') || c.includes('rus') || c.includes('steppe') || c.includes('hungar') || c.includes('polish') || r === 'muscovy' || r === 'poland' || r === 'lithuania' || r === 'hungary' || r === 'golden_horde') return 'Slavic & Steppe';
 if (c.includes('latin') || c.includes('roman') || c.includes('iberian') || c.includes('italian') || c.includes('greek') || c.includes('byzant') || r === 'venice' || r === 'papacy' || r === 'castile' || r === 'aragon' || r === 'portugal' || r === 'naples') return 'Mediterranean';
 if (continent === 'Asia' || f.includes('islam') || f.includes('sunni') || f.includes('shia') || f.includes('hindu') || f.includes('buddh') || f.includes('confuc') || r === 'ottomans' || r === 'mamluks' || r === 'timurids' || r === 'ming') return 'Asia';
 if (continent === 'Africa' || r === 'mali' || r === 'ethiopia' || r === 'songhai' || r === 'morocco' || r === 'kongo') return 'Africa';
 if (continent === 'North America') return 'North America';
 if (continent === 'South America') return 'South America';
 if (continent === 'Oceania') return 'Oceania';
 return 'Western Europe';
}

function addUsed(reg, realm, fullName) {
 if (!fullName || typeof fullName !== 'string') return;
 const clean = fullName.trim();
 if (!clean) return;
 reg.usedFull.add(clean);
 const given = clean.split(/\s+/)[0];
 if (realm && given) {
  let set = reg.usedRealmGiven.get(realm);
  if (!set) {
   set = new Set();
   reg.usedRealmGiven.set(realm, set);
  }
  set.add(given);
 }
}

function getNameRegistry(g) {
 if (!g || typeof g !== 'object') {
  return { usedFull: new Set(), usedRealmGiven: new Map(), usedHouses: new Set(), seq: 1 };
 }
 let reg = REGISTRY_MAP.get(g);
 if (reg) return reg;
 reg = { usedFull: new Set(), usedRealmGiven: new Map(), usedHouses: new Set(), seq: 1 };
 REGISTRY_MAP.set(g, reg);

 // Seed from any existing state so loaded saves preserve uniqueness
 for (const [rid, c] of Object.entries(g.kingdom?.courts || {})) {
  if (c?.dynasty) reg.usedHouses.add(c.dynasty);
  if (c?.ruler?.name) addUsed(reg, rid, c.ruler.name);
  if (c?.heir?.name) addUsed(reg, rid, c.heir.name);
 }
 for (const p of Object.values(g.politics?.people || {})) {
  if (p?.house) reg.usedHouses.add(p.house);
  if (p?.name) addUsed(reg, p.realm, p.name);
 }
 for (const pol of Object.values(g.independentPolities || {})) {
  if (pol?.dynasty) reg.usedHouses.add(pol.dynasty);
  if (pol?.ruler?.name) addUsed(reg, pol.id, pol.ruler.name);
 }
 for (const seat of g.deepSystems?.curia?.cardinals || []) {
  if (seat?.name) addUsed(reg, seat.realm || 'papacy', seat.name);
 }
 if (g.deepSystems?.curia?.pope?.name) {
  addUsed(reg, 'papacy', g.deepSystems.curia.pope.name);
 }
 for (const a of Object.values(g.armies || {})) {
  if (a?.commander && a.commander !== 'Newly appointed general') addUsed(reg, a.owner, a.commander);
 }
 return reg;
}

/**
 * Allocate a globally unique full personal name for a ruler, noble, consort, or child.
 * Attempts unused given names within the realm first, then fresh Surname/Place combinations.
 */
export function allocateCharacterName(g, opts = {}) {
 const reg = getNameRegistry(g);
 const f = opts.realm ? g?.factions?.[opts.realm] : null;
 const continent = opts.continent || f?.continent || 'Europe';
 const poolKey = resolvePoolKey(continent, opts.culture || f?.culture, opts.faith || f?.religion, opts.realm);
 const pool = NAME_POOLS[poolKey] || NAME_POOLS['Western Europe'];
 const sex = opts.sex === 'female' ? 'female' : 'male';
 const givenList = pool[sex];
 const surnameList = pool.surnames;
 const baseSeed = hashNameSeed(`${opts.seed ?? reg.seq++}:${opts.realm || ''}:${poolKey}:${sex}`);

 const realmGiven = opts.realm ? (reg.usedRealmGiven.get(opts.realm) || null) : null;
 const place = opts.place ? String(opts.place).replace(/\s*·\s*\d+$/, '').trim() : '';

 // Prefer unused given names inside the realm when generating named characters
 for (let gOff = 0; gOff < givenList.length; gOff++) {
  const given = givenList[(baseSeed + gOff * 7) % givenList.length];
  if (realmGiven && realmGiven.has(given) && gOff < givenList.length - 4) continue;

  if (opts.withSeat && place) {
   const seatCandidate = `${given} of ${place}`;
   if (!reg.usedFull.has(seatCandidate)) {
    addUsed(reg, opts.realm, seatCandidate);
    return seatCandidate;
   }
  }
  for (let sOff = 0; sOff < surnameList.length; sOff++) {
   const sn = surnameList[((baseSeed >>> 3) + sOff * 11) % surnameList.length];
   const candidate = `${given} ${sn}`;
   if (!reg.usedFull.has(candidate)) {
    addUsed(reg, opts.realm, candidate);
    return candidate;
   }
  }
 }

 // Secondary cross-surname sweep without realmGiven restriction
 for (let i = 0; i < givenList.length * surnameList.length; i++) {
  const gi = (baseSeed + i) % givenList.length;
  const si = ((baseSeed >>> 5) + Math.floor(i / givenList.length) + gi * 3) % surnameList.length;
  const candidate = `${givenList[gi]} ${surnameList[si]}`;
  if (!reg.usedFull.has(candidate)) {
   addUsed(reg, opts.realm, candidate);
   return candidate;
  }
 }

 // Ultimate deterministic compound surname fallback (still zero ugly numeric ids)
 let k = reg.seq++;
 while (true) {
  const g1 = givenList[(baseSeed + k) % givenList.length];
  const s1 = surnameList[(baseSeed + k * 5) % surnameList.length];
  const s2 = surnameList[(baseSeed + k * 13 + 7) % surnameList.length];
  if (s1 === s2) { k++; continue; }
  const candidate = `${g1} ${s1}-${s2}`;
  if (!reg.usedFull.has(candidate)) {
   addUsed(reg, opts.realm, candidate);
   return candidate;
  }
  k++;
 }
}

/**
 * Allocate a unique 'House of <Seat>' dynasty name.
 */
export function allocateHouseName(g, opts = {}) {
 const reg = getNameRegistry(g);
 if (opts.preferred && !reg.usedHouses.has(opts.preferred)) {
  reg.usedHouses.add(opts.preferred);
  return opts.preferred;
 }
 const f = opts.realm ? g?.factions?.[opts.realm] : null;
 const poolKey = resolvePoolKey(opts.continent || f?.continent || 'Europe', opts.culture || f?.culture, opts.faith || f?.religion, opts.realm);
 const pool = NAME_POOLS[poolKey] || NAME_POOLS['Western Europe'];
 const baseSeed = hashNameSeed(`house:${opts.seed ?? reg.seq++}:${opts.realm || ''}:${poolKey}`);
 for (let i = 0; i < pool.surnames.length; i++) {
  const seat = pool.surnames[(baseSeed + i * 7) % pool.surnames.length];
  const candidate = `House of ${seat}`;
  if (!reg.usedHouses.has(candidate)) {
   reg.usedHouses.add(candidate);
   return candidate;
  }
 }
 // Cross-pool fallback
 const allSurnames = Object.values(NAME_POOLS).flatMap(p => p.surnames);
 for (let i = 0; i < allSurnames.length; i++) {
  const seat = allSurnames[(baseSeed + i * 11) % allSurnames.length];
  const candidate = `House of ${seat}`;
  if (!reg.usedHouses.has(candidate)) {
   reg.usedHouses.add(candidate);
   return candidate;
  }
 }
 const fallback = `House of ${pool.surnames[baseSeed % pool.surnames.length]} ${reg.seq++}`;
 reg.usedHouses.add(fallback);
 return fallback;
}

/**
 * Allocate a unique titled military commander name for an army.
 */
export function allocateCommanderName(g, ownerId, seed = 0) {
 const reg = getNameRegistry(g);
 const f = ownerId ? g?.factions?.[ownerId] : null;
 const poolKey = resolvePoolKey(f?.continent || 'Europe', f?.culture, f?.religion, ownerId);
 const pool = NAME_POOLS[poolKey] || NAME_POOLS['Western Europe'];
 const title = pool.titles[hashNameSeed(`${ownerId}:${seed}:title`) % pool.titles.length];
 const base = allocateCharacterName(g, {
  realm: ownerId,
  continent: f?.continent,
  culture: f?.culture,
  faith: f?.religion,
  sex: (hashNameSeed(`${ownerId}:${seed}:sex`) % 9 === 0) ? 'female' : 'male',
  seed: `cmd:${ownerId}:${seed}:${reg.seq}`
 });
 const titled = `${title} ${base}`;
 if (!reg.usedFull.has(titled)) {
  reg.usedFull.add(titled);
  return titled;
 }
 return base;
}

/**
 * Allocate a unique Catholic Cardinal prelate name.
 */
export function allocateCardinalName(g, realmId, idx = 1) {
 const reg = getNameRegistry(g);
 const seed = hashNameSeed(`cardinal:${realmId || 'papacy'}:${idx}`);
 for (let i = 0; i < CARDINAL_GIVEN.length * CARDINAL_SURNAMES.length; i++) {
  const gName = CARDINAL_GIVEN[(seed + i) % CARDINAL_GIVEN.length];
  const sName = CARDINAL_SURNAMES[((seed >>> 3) + Math.floor(i / CARDINAL_GIVEN.length) + i * 3) % CARDINAL_SURNAMES.length];
  const candidate = `Cardinal ${gName} ${sName}`;
  if (!reg.usedFull.has(candidate)) {
   addUsed(reg, realmId || 'papacy', candidate);
   return candidate;
  }
 }
 return allocateCharacterName(g, { realm: realmId || 'papacy', continent: 'Europe', culture: 'Italian', seed: `card:${idx}` });
}

/**
 * Allocate the next distinct Papal name on succession.
 */
export function allocatePopeName(g, seed = 0) {
 const reg = getNameRegistry(g);
 for (let i = 0; i < PAPAL_NAMES.length; i++) {
  const candidate = PAPAL_NAMES[(seed + i) % PAPAL_NAMES.length];
  if (!reg.usedFull.has(candidate)) {
   addUsed(reg, 'papacy', candidate);
   return candidate;
  }
 }
 const extra = `Pope Urban ${['VIII','IX','X','XI','XII'][seed % 5]}`;
 addUsed(reg, 'papacy', extra);
 return extra;
}
