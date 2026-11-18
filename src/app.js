"use strict";
const VERSION = "2.0.0";
const LOGO = '<svg viewBox="0 0 512 512" aria-hidden="true"><rect width="512" height="512" fill="#12141B"/><g transform="translate(256 268) skewX(-14)"><rect x="-150" y="20" width="76" height="120" rx="38" fill="#8592FF"/><rect x="-38" y="-60" width="76" height="200" rx="38" fill="#FF7A3D"/><rect x="74" y="-140" width="76" height="280" rx="38" fill="#38D38A"/></g></svg>';
const TT = q => "https://www.tiktok.com/search?q=" + encodeURIComponent(q);
const RED = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =================== DATOS DEL PLAN =================== */
const EX = {
  sentadilla:{n:"Sentadilla con mochila",q:"sentadilla con mochila en casa",how:["Mochila con peso a la espalda, pies a la anchura de los hombros.","Baja llevando la cadera atrás hasta que los muslos queden paralelos al suelo.","Rodillas en la línea de las puntas de los pies. Sube empujando con los talones."],prog:"Mochila ligera → mochila llena → búlgara con mochila"},
  bulgara:{n:"Sentadilla búlgara",q:"sentadilla bulgara tecnica",how:["Pie trasero apoyado en una silla o banco.","Baja en vertical hasta que la rodilla trasera casi toque el suelo.","Tronco algo inclinado adelante. Sube con la pierna delantera."]},
  puente:{n:"Puente de glúteo a una pierna",q:"puente gluteo una pierna",how:["Tumbado boca arriba, una pierna doblada y la otra estirada en el aire.","Sube la cadera apretando el glúteo hasta alinear rodilla, cadera y hombro.","Aguanta 1 s arriba y baja despacio."]},
  zancadas:{n:"Zancadas caminando",q:"zancadas caminando tecnica",how:["Da un paso largo y baja hasta que ambas rodillas formen 90°.","La rodilla delantera no pasa de la punta del pie.","Empuja y avanza con la otra pierna."]},
  gemelos:{n:"Elevación de gemelos a una pierna",q:"elevacion gemelos una pierna",how:["De pie en un escalón con la punta de un pie. Apóyate en la pared.","Sube de puntillas lo más alto posible.","Baja despacio hasta notar el estiramiento."]},
  planchaLat:{n:"Plancha lateral",q:"plancha lateral tecnica",how:["Apoya el antebrazo bajo el hombro y los pies uno sobre otro.","Sube la cadera hasta formar una línea recta.","Aguanta sin dejar caer la cadera."]},
  bici:{n:"Bicicleta abdominal",q:"bicicleta abdominal tecnica",how:["Tumbado, manos en la sien y hombros despegados del suelo.","Lleva el codo hacia la rodilla contraria mientras estiras la otra pierna.","Alterna lados sin tirar del cuello. Cada lado cuenta 1."]},
  flexiones:{n:"Flexiones",q:"flexiones tecnica correcta",how:["Manos algo más abiertas que los hombros, cuerpo en línea recta.","Baja en 2 s hasta que el pecho casi toque el suelo. Codos a 45°.","Empuja fuerte hacia arriba sin hundir la cadera."],prog:"Normales → con pausa → pies elevados → con mochila → arqueras"},
  pica:{n:"Flexiones en pica (pike)",q:"flexiones en pica pike push up",how:["Forma una V invertida: cadera arriba, manos y pies en el suelo.","Dobla los codos y baja la cabeza hacia el suelo, por delante de las manos.","Empuja de vuelta. Trabaja el hombro sin cargar la articulación."],prog:"Pies en el suelo → pies en banco → pies en banco con pausa"},
  pausa:{n:"Flexiones con pausa abajo",q:"flexiones con pausa",how:["Igual que una flexión normal.","Abajo, aguanta 2 s a 2-3 cm del suelo.","Sube de forma explosiva."]},
  aperturas:{n:"Aperturas de pecho con banda",q:"aperturas pecho banda elastica",how:["Banda anclada a tu espalda a la altura del pecho.","Brazos abiertos con codos ligeramente doblados.","Junta las manos delante del pecho y vuelve despacio."]},
  elevLat:{n:"Elevaciones laterales con banda",q:"elevaciones laterales banda elastica",how:["Pisa la banda y sujeta un extremo en cada mano.","Sube los brazos por los lados hasta la altura del hombro, no más.","Baja en 2 s. Sin balanceo."]},
  diamante:{n:"Flexiones diamante",q:"flexiones diamante tecnica",how:["Une índices y pulgares formando un diamante bajo el pecho.","Baja con los codos pegados al cuerpo.","Si cuesta, apoya las manos en un banco (inclinadas)."]},
  plancha:{n:"Plancha",q:"plancha abdominal tecnica correcta",how:["Antebrazos bajo los hombros, cuerpo recto de cabeza a talones.","Aprieta abdomen y glúteos. No subas ni hundas la cadera.","Respira normal mientras aguantas."],prog:"Plancha → plancha con toque de hombro"},
  crunchInv:{n:"Crunch invertido",q:"crunch invertido tecnica",how:["Tumbado, piernas dobladas a 90° en el aire.","Lleva las rodillas al pecho despegando la cadera del suelo.","Baja despacio sin apoyar los pies."]},
  dominadas:{n:"Dominadas estrictas",q:"dominadas estrictas tecnica",how:["Agarre prono (palmas al frente) a la anchura de los hombros.","Sube hasta pasar la barbilla de la barra, sin impulso.","Baja controlado hasta casi estirar los brazos. Deja 1 rep en reserva."],prog:"Negativas + 1-3 reps → 4 × 3-5 → 4 × 6-8 → con mochila ligera"},
  negativas:{n:"Dominadas negativas",q:"dominadas negativas",how:["Sube de un salto o con una silla hasta tener la barbilla sobre la barra.","Baja en 5 s contados, controlando todo el recorrido.","No te sueltes de golpe abajo (regla de hombro)."]},
  remo:{n:"Remo australiano",q:"remo australiano barra",how:["Bajo una barra baja, cuerpo recto y talones en el suelo.","Tira llevando el pecho a la barra y junta las escápulas.","Baja en 2 s."],prog:"Barra alta → barra baja → pies elevados → pausa de 2 s arriba"},
  curl:{n:"Curl de bíceps con banda",q:"curl biceps banda elastica",how:["Pisa la banda, palmas hacia delante.","Sube las manos a los hombros con los codos pegados.","Baja despacio sin balancear el cuerpo."]},
  facepull:{n:"Face pull con banda",q:"face pull banda elastica",how:["Banda anclada a la altura de la cara.","Tira hacia la frente abriendo los codos hacia fuera y atrás.","Aprieta las escápulas 1 s y vuelve."]},
  rotExt:{n:"Rotación externa con banda",q:"rotacion externa hombro banda elastica",how:["Codo pegado al costado y doblado a 90°.","Gira el antebrazo hacia fuera sin separar el codo.","Vuelve despacio. Clave para tu hombro derecho."]},
  rodillas:{n:"Elevación de rodillas colgado",q:"elevacion de rodillas en barra",how:["Cuélgate de la barra con agarre firme y hombros activos.","Sube las rodillas al pecho sin balancearte.","Baja controlado. Nunca te sueltes de golpe."],prog:"Rodillas colgado → piernas rectas colgado"},
  deadbug:{n:"Dead bug",q:"dead bug ejercicio abdomen",how:["Boca arriba, brazos al techo y rodillas a 90°.","Estira brazo y pierna contrarios sin despegar la zona lumbar.","Vuelve y cambia de lado."]},
  flexPies:{n:"Flexiones con pies elevados",q:"flexiones declinadas pies elevados",how:["Pies sobre un banco o escalón, manos en el suelo.","Baja en 2 s con el cuerpo recto.","Semanas 1-3: hazlas normales."]},
  dominadasD:{n:"Dominadas o negativas",q:"dominadas estrictas tecnica",how:["Haz tus dominadas máximas menos 1 en cada serie.","Si no sale ninguna, haz negativas de 5 s.","Siempre sin impulso."]},
  pullapart:{n:"Separaciones con banda",q:"band pull apart banda elastica",how:["Banda delante del pecho, brazos estirados.","Abre los brazos hasta tocar el pecho con la banda.","Junta las escápulas y vuelve despacio."]}
};
const SESS = {
  C:{name:"Piernas + abdomen",place:"Casa",items:[["sentadilla",4,"12-20",90],["bulgara",3,"8-12 / pierna",90],["puente",3,"10-15 / pierna",60],["zancadas",3,"10 / pierna",60],["gemelos",3,"15-20",45],["planchaLat",3,"30 s / lado",45],["bici",3,"20",45]]},
  A:{name:"Empuje: pecho, hombro y tríceps",place:"Parque o casa",items:[["flexiones",4,"6-12",90],["pica",3,"6-10",90],["pausa",3,"6-10",90],["aperturas",3,"12-15",60],["elevLat",3,"12-20",60],["diamante",3,"8-12",60],["plancha",3,"30-45 s",45],["crunchInv",3,"10-15",45]]},
  B:{name:"Tirón: espalda y bíceps",place:"Parque (barra)",items:[["dominadas",5,"1-3",120],["negativas",3,"3",120],["remo",4,"8-12",90],["curl",3,"10-15",60],["facepull",3,"15",60],["rotExt",2,"15 / brazo",45],["rodillas",3,"8-12",60],["deadbug",3,"10 / lado",45]]},
  D:{name:"Torso completo",place:"Parque",items:[["flexPies",4,"6-12",90],["dominadasD",4,"máx. −1",120],["pica",3,"6-10",90],["remo",3,"10-12",60],["elevLat",3,"15-20",45]]}
};
const WARM = [["2 min de trote suave o jumping jacks bajos","jumping jacks tecnica"],["Círculos de brazos: 10 adelante, 10 atrás",null],["Rotación externa con banda: 15 por brazo","rotacion externa hombro banda elastica"],["Separaciones con banda (pull-aparts): 15","band pull apart banda elastica"],["Flexiones escapulares: 10","flexiones escapulares"],["Sentadillas sin peso: 10",null],["1 serie fácil del primer ejercicio",null]];
const STRETCH = [["Pecho en marco de puerta (brazo a 90°, sin forzar el hombro derecho)","estiramiento pectoral pared"],["Dorsal: manos en la barra, cadera atrás","estiramiento dorsal de pie"],["Tríceps por encima de la cabeza","estiramiento triceps"],["Cuádriceps de pie","estiramiento cuadriceps de pie"],["Isquios con la pierna en un banco","estiramiento isquiotibiales"],["Flexor de cadera en zancada","estiramiento flexor de cadera"],["Gemelos contra la pared","estiramiento gemelos pared"]];
const MOB = [["Gato-camello: 10","gato camello movilidad"],["Rotaciones torácicas en cuadrupedia: 10 por lado","rotacion toracica cuadrupedia"],["Sentadilla profunda mantenida: 3 × 30 s","sentadilla profunda movilidad"],["Ángeles en la pared: 2 × 10","angeles en la pared wall angels"],["Estiramiento 90/90 de cadera: 60 s por lado","90 90 cadera movilidad"],["Cobra suave: 3 × 20 s","estiramiento cobra abdomen"],["Rotación externa con banda: 2 × 15 por brazo","rotacion externa hombro banda elastica"]];
const SHOULDER = "Prohibido: fondos profundos, dominadas con impulso, muscle-ups, ejercicios tras nuca y soltarse de la barra de golpe. Todo con 2 s bajando. Si el hombro se nota inestable, para la serie.";

/* ---------- Running ---------- */
const PACE = {suave:7.0, rapido:5.75, trote:7.5};
const PNAME = {suave:"Suave", rapido:"Rápido", trote:"Trote"};
const fmtPace = p => Math.floor(p)+":"+String(Math.round((p%1)*60)).padStart(2,"0");
function intervals(warm,reps,fast,slow){const s=[{t:warm,k:"suave"}];for(let i=0;i<reps;i++){s.push({t:fast,k:"rapido"});s.push({t:slow,k:"trote"});}return s;}
const WED = [20,25,30,20,30,35,40,25,40,45,45,"test"];
function thuRun(w){
  if(w<=3) return [{t:15,k:"suave"}];
  if(w===4||w===8||w===12) return [{t:10,k:"suave"}];
  if(w===5||w===6) return intervals(5,6,1,1);
  if(w===7||w===9) return intervals(5,8,1,1);
  if(w===10) return intervals(5,5,2,1);
  return intervals(5,6,2,1);
}
function runFor(dow,w){
  const deload = w===4||w===8;
  if(dow===1||dow===2) return {title:"Carrera muy suave",sub:"Al acabar la sesión de "+(dow===1?"empuje":"tirón")+". Debes poder hablar sin esfuerzo.",segs:[{t:deload?10:18,k:"suave"}],range:deload?"10":"15-20"};
  if(dow===3){const v=WED[w-1]; if(v==="test") return {title:"Test 5 km",sub:"Calienta 5 min andando rápido. Luego 5 km al máximo ritmo que puedas mantener. Apunta el tiempo en Progreso.",segs:[{t:30,k:"rapido"}],test:true};
    return {title:"Carrera continua",sub:"Ritmo de conversación todo el rato. Si te ahogas, baja el ritmo.",segs:[{t:v,k:"suave"}]};}
  if(dow===4){const s=thuRun(w);return {title:s.length>1?"Series cortas":"Carrera corta",sub:"Al final de la sesión D de torso.",segs:s};}
  return null;
}
function runStats(r){
  if(r.test) return {min:"≈30",km:"5,0",pace:"6:00",kmN:5};
  let min=0,km=0;r.segs.forEach(s=>{min+=s.t;km+=s.t/PACE[s.k];});
  return {min:String(min),km:km.toFixed(1).replace(".",","),pace:fmtPace(min/km),kmN:km};
}

/* ---------- Comida ---------- */
const R = {
  desA:{n:"Avena con plátano + 2 huevos cocidos",kcal:610,p:31,min:10,ing:[["Copos de avena","60 g"],["Leche semidesnatada","300 ml"],["Plátano pelado","120 g (1 mediano)"],["Huevos M cocidos","2 (100 g)"]],prep:["Avena y leche en un cazo a fuego medio, 5 min removiendo.","Plátano en rodajas por encima.","Huevos: 10 min en agua hirviendo. Cuece 8 el domingo; aguantan 7 días en la nevera con cáscara."]},
  desB:{n:"Tostadas con tomate + revuelto de 3 huevos",kcal:640,p:37,min:10,ing:[["Pan integral de molde","90 g (3 rebanadas)"],["Tomate rallado","100 g"],["Aceite de oliva","8 g"],["Huevos M","3 (150 g)"],["Leche semidesnatada","250 ml"],["Sal","1 g"]],prep:["Tostadas con tomate rallado y 5 g de aceite.","Huevos batidos con la sal, en sartén con 3 g de aceite a fuego bajo, 2 min removiendo.","Acompaña con el vaso de leche."]},
  merA:{n:"Bol de queso batido, avena y cacahuete",kcal:390,p:29,min:3,ing:[["Queso fresco batido 0 %","250 g"],["Copos de avena","30 g"],["Crema de cacahuete","15 g"],["Fruta troceada","150 g"]],prep:["Todo en un bol y mezcla."]},
  merB:{n:"Bocadillo de tortilla francesa + fruta",kcal:440,p:22,min:8,ing:[["Pan integral de molde","80 g"],["Huevos M","2 (100 g)"],["Aceite de oliva","3 g"],["Fruta","150 g"]],prep:["Bate los huevos y cuaja la tortilla con el aceite, 2 min por lado.","Monta el bocadillo. Fruta de postre."]},
  merC:{n:"Tostadas con crema de cacahuete + plátano + leche",kcal:490,p:20,min:5,ing:[["Pan integral tostado","60 g (2 rebanadas)"],["Crema de cacahuete","20 g"],["Plátano","120 g"],["Leche semidesnatada","250 ml"]],prep:["Tuesta el pan y unta la crema de cacahuete.","Plátano y vaso de leche."]},
  arrozPollo:{n:"Arroz con pollo y verduras",kcal:690,p:49,min:30,batch:true,ing:[["Arroz","100 g","200 g"],["Pechuga de pollo","175 g","350 g"],["Verdura congelada","100 g","200 g"],["Cebolla","60 g","120 g"],["Aceite de oliva","10 g","20 g"],["Agua","250 ml","500 ml"],["Sal","2 g","4 g"],["Pimentón","2 g","4 g"],["Ajo en polvo","1 g","2 g"]],prep:["Corta la pechuga en dados de 2 cm. Dórala con 10 g de aceite, la sal y el pimentón, 5 min a fuego fuerte. Sácala.","En la misma olla, 10 g de aceite y la cebolla picada, 5 min a fuego medio. Añade la verdura, 3 min.","Añade el arroz, el ajo, el pollo y los 500 ml de agua hirviendo. 18 min a fuego medio sin remover.","Reposa 5 min tapado. Reparte en 2 táperes."]},
  lentejas:{n:"Lentejas con carne picada",kcal:655,p:43,min:20,batch:true,ing:[["Lentejas cocidas escurridas","200 g","400 g (1 bote)"],["Carne picada mixta","125 g","250 g"],["Tomate triturado","50 g","100 g"],["Cebolla","50 g","100 g"],["Aceite de oliva","5 g","10 g"],["Ajo","5 g","10 g (2 dientes)"],["Agua","100 ml","200 ml"],["Pimentón","2 g","4 g"],["Comino","1 g","2 g"],["Sal","1 g","2 g"],["Pan integral","40 g","80 g"]],prep:["Lava las lentejas en un colador y escúrrelas.","Sofríe cebolla y ajo picados con el aceite, 4 min a fuego medio.","Añade la carne y dórala 5 min, deshaciéndola con la cuchara.","Añade especias, sal, tomate, lentejas y agua. 10 min a fuego bajo. Reparte en 2 táperes."]},
  arrozCarne:{n:"Arroz con carne picada, tomate y verduras",kcal:750,p:34,min:30,batch:true,ing:[["Arroz","100 g","200 g"],["Carne picada mixta","125 g","250 g"],["Verdura congelada","100 g","200 g"],["Tomate triturado","80 g","160 g"],["Cebolla","50 g","100 g"],["Aceite de oliva","5 g","10 g"],["Sal","2 g","4 g"],["Orégano","1 g","2 g"]],prep:["Cuece el arroz en 1,5 L de agua con la mitad de la sal, 15-18 min. Escurre.","Sofríe la cebolla con el aceite 4 min. Añade la carne, 5 min. Añade la verdura, 5 min. Añade tomate, orégano y el resto de sal, 5 min.","Mezcla con el arroz y reparte en 2 táperes. El del sábado, al congelador."]},
  polloHorno:{n:"Pollo al horno con patata, cebolla y verduras",kcal:655,p:48,min:45,ing:[["Pechuga de pollo","180 g"],["Patata","300 g"],["Cebolla","60 g"],["Verdura congelada","100 g"],["Aceite de oliva","10 g"],["Pimentón","2 g"],["Ajo en polvo","1 g"],["Sal","2 g"],["Pan integral","40 g"]],prep:["Precalienta el horno a 200 °C.","Patata en gajos de 2 cm y cebolla en tiras, en una bandeja con 5 g de aceite y 1 g de sal. 20 min.","Añade la pechuga en 3 trozos con pimentón, ajo, 1 g de sal y 5 g de aceite, y la verdura. 20-25 min más, dando la vuelta a mitad.","Está hecha cuando por dentro está blanca y suelta jugo transparente."]},
  tortillaPatata:{n:"Tortilla de patata (4 huevos) + ensalada",kcal:735,p:43,min:30,ing:[["Huevos M","4 (200 g)"],["Patata","250 g"],["Cebolla","40 g"],["Aceite de oliva","15 g"],["Lechuga o ensalada de bolsa","80 g"],["Tomate","100 g"],["Sal","2 g"],["Postre: queso fresco batido 0 %","150 g"]],prep:["Patata y cebolla en láminas de 3 mm con 5 g de aceite y 1 g de sal. Air fryer 18-20 min a 180 °C, removiendo a mitad.","Bate los huevos con 1 g de sal y mezcla con la patata.","Sartén antiadherente con 5 g de aceite a fuego medio-bajo: 3-4 min por lado. Dale la vuelta con un plato.","Ensalada con el tomate y 5 g de aceite."]},
  pechugaAir:{n:"Pechuga y patata en air fryer + verdura",kcal:570,p:50,min:25,ing:[["Pechuga de pollo","180 g"],["Patata","300 g"],["Verdura congelada","150 g"],["Aceite de oliva","10 g"],["Sal","2 g"],["Pimentón u orégano","2 g"]],prep:["Patata en dados de 2 cm con 5 g de aceite y 1 g de sal. Air fryer 10 min a 200 °C.","Añade la pechuga en tiras con la especia y 1 g de sal. 12-15 min a 190 °C, removiendo a mitad.","Verdura en sartén con 5 g de aceite, 6-8 min a fuego fuerte."]},
  revuelto:{n:"Revuelto de 3 huevos con verduras + tostadas",kcal:600,p:40,min:10,ing:[["Huevos M","3 (150 g)"],["Verdura congelada","150 g"],["Aceite de oliva","5 g"],["Pan integral de molde","60 g (2 rebanadas)"],["Sal","1 g"],["Postre: queso fresco batido 0 %","150 g"],["Postre: fruta","150 g"]],prep:["Saltea la verdura con el aceite, 5 min a fuego fuerte.","Baja el fuego, echa los huevos batidos con la sal y remueve 2 min hasta que cuajen.","Tostadas en la tostadora."]},
  pechugaPlancha:{n:"Pechuga a la plancha + arroz + verdura",kcal:620,p:50,min:15,ing:[["Pechuga de pollo fileteada","180 g"],["Arroz (cocido el miércoles)","80 g en crudo (≈240 g cocido)"],["Verdura congelada","150 g"],["Aceite de oliva","10 g"],["Sal","2 g"]],prep:["Plancha con 5 g de aceite a fuego fuerte. Pechuga 3-4 min por lado.","Saltea la verdura con 5 g de aceite, 6 min.","Calienta el arroz en la misma sartén, 2 min."]},
  francesa:{n:"Tortilla francesa + ensalada + pan",kcal:540,p:39,min:10,ing:[["Huevos M","3 (150 g)"],["Lechuga o ensalada de bolsa","80 g"],["Tomate","100 g"],["Aceite de oliva","8 g"],["Pan integral de molde","60 g (2 rebanadas)"],["Sal","2 g"],["Postre: queso fresco batido 0 %","150 g"]],prep:["Bate los huevos con 1 g de sal. Sartén con 3 g de aceite a fuego medio, 2 min por lado.","Ensalada con el tomate, 5 g de aceite y 1 g de sal."]},
  precocinado:{n:"Precocinado de recurso",kcal:600,p:35,min:5,approx:true,combos:[["Bote de lentejas + pechuga asada en lonchas + tomate","3,50 €"],["Taquitos de pollo + vasito de arroz + verdura congelada en air fryer","3,50 €"],["¼ o ½ pollo asado + pan + ensalada de bolsa","3-4 €"],["Crema de lentejas Hacendado + 2 huevos cocidos + pan","2,50 €"],["Bocadillo integral + pavo en lonchas + queso fresco + fruta","2,50 €"]],prep:["Regla: mínimo 25 g de proteína, nada empanado ni frito, sin salsas cremosas.","Proteína lista + hidrato listo + verdura. 5 minutos."]},
  libre:{n:"Comida libre",kcal:null,p:null,min:0,libre:true,prep:["1 comida libre por semana. No es un día libre.","Disfrútala sin culpa y vuelve al plan mañana."]}
};
const SLOT_OPTS = {d:["desA","desB"],c:["arrozPollo","lentejas","arrozCarne","polloHorno","pechugaAir","pechugaPlancha","precocinado"],m:["merA","merB","merC"],n:["tortillaPatata","pechugaAir","revuelto","pechugaPlancha","francesa","precocinado","libre","arrozPollo","lentejas","arrozCarne"]};
const MENU = {
  0:{d:"desA",c:"polloHorno",m:"merC",n:"francesa"},
  1:{d:"desA",c:"arrozPollo",m:"merA",n:"tortillaPatata"},
  2:{d:"desB",c:"lentejas",m:"merB",n:"pechugaAir"},
  3:{d:"desA",c:"arrozPollo",m:"merC",n:"revuelto"},
  4:{d:"desB",c:"arrozCarne",m:"merA",n:"pechugaPlancha"},
  5:{d:"desA",c:"lentejas",m:"merB",n:"precocinado"},
  6:{d:"desB",c:"arrozCarne",m:"merC",n:"libre"}
};
const COOK = {0:"Batch cooking (1 h): lentejas con carne picada (2 raciones) y arroz con pollo (2 raciones).",3:"Batch cooking (45 min): arroz con carne picada (2 raciones) y pechugas para el jueves."};
const MEALS = [["d","8:30","Desayuno"],["c","14:00","Comida"],["m","17:30","Merienda"],["n","22:00","Cena"]];
const SHOP=[["Huevos M","24 + 12 unidades","8,28 €"],["Pechuga de pollo","1 kg","6,00 €"],["Carne picada mixta","500 g","3,30 €"],["Pan integral de molde","2 paquetes","3,00 €"],["Leche semidesnatada","3 L","2,70 €"],["Queso fresco batido 0 %","2 × 500 g","2,60 €"],["Fruta (naranjas, manzanas)","2 kg","2,50 €"],["Ensalada y tomates","2 bolsas + 1 kg","2,50 €"],["Verdura congelada","2 bolsas","2,40 €"],["Aceite de oliva","1 L al mes","2,00 €"],["Plátanos","1 kg","1,70 €"],["Patatas","malla 3 kg (2 semanas)","1,50 €"],["Arroz","1 kg","1,20 €"],["Copos de avena","500 g","1,00 €"],["Cebolla y ajo","1 kg + 1 cabeza","1,00 €"],["Lentejas cocidas","1 bote","0,90 €"],["Crema de cacahuete","dura 3 semanas","0,80 €"],["Tomate triturado","1 bote","0,70 €"]];
const TESTS=[["flex","Flexiones máximas","reps",1],["dom","Dominadas máximas","reps",1],["plank","Plancha máxima","s",1],["cint","Cintura (ombligo)","cm",-1],["peso","Peso en ayunas","kg",-1],["k5","5 km","min",-1]];

const DAYSESS = {0:"C",1:"A",2:"B",3:"MOB",4:"D",5:null,6:null};
const DL = ["D","L","M","X","J","V","S"];
const DNAME = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const MES = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];

/* =================== UTILIDADES =================== */
const pad = n => String(n).padStart(2,"0");
const key = d => d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const parse = k => {const [y,m,d]=k.split("-").map(Number);return new Date(y,m-1,d);};
const addD = (d,n) => {const x=new Date(d);x.setDate(x.getDate()+n);return x;};
const today = () => {const t=new Date();return new Date(t.getFullYear(),t.getMonth(),t.getDate());};
let TODAY = today();
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const miles = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g,".");
const dec = v => String(v).replace(".",",");
const fmtT = s => Math.floor(s/60)+":"+pad(s%60);
const num = v => {const n=parseFloat(String(v).replace(",",".")); return isFinite(n)?Math.round(n*10)/10:null;};
const fdate = d => d.getDate()+" "+MES[d.getMonth()];
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>';
const BACK = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round"><path d="M15 6l-6 6 6 6"/></svg>';
const standalone = () => (navigator.standalone===true) || matchMedia("(display-mode: standalone)").matches;

/* =================== ESTADO =================== */
const LSK = "cambio-fisico-v1";
const DEF = () => ({v:2,start:key(today()),name:"",onboarded:false,log:{},best:0,updated:0,m4:{},meas:{},tests:{w1:{},w12:{}},adj:[],shop:{},plan:{sess:{},menu:{}},recap:{},voice:true});
function migrate(s){
  s=Object.assign(DEF(),s||{});
  s.plan=Object.assign({sess:{},menu:{}},s.plan||{}); s.tests=Object.assign({w1:{},w12:{}},s.tests||{});
  // v1: repeticiones por índice → por ejercicio
  for(const k in s.log){const l=s.log[k]; if(!l||!l.reps) continue;
    const ks=Object.keys(l.reps); if(!ks.some(x=>/^\d+$/.test(x))) continue;
    const code=DAYSESS[parse(k).getDay()], items=SESS[code]?SESS[code].items:[], o={};
    ks.forEach(x=>{ if(/^\d+$/.test(x)){ const it=items[+x]; if(it) o[it[0]]=l.reps[x]; } else o[x]=l.reps[x]; });
    l.reps=o; delete l.s;}
  s.v=2; return s;
}
let S = DEF();
try{const r=localStorage.getItem(LSK); if(r) S=migrate(JSON.parse(r));}catch(e){}
let ui = {tab:"ej", sel:key(TODAY), open:{}, two:false};
try{const t=localStorage.getItem(LSK+"-tab"); if(t) ui.tab=t;}catch(e){}

const getSess = code => (S.plan.sess&&S.plan.sess[code]) || (SESS[code]?SESS[code].items:[]);
const getMenu = dow => Object.assign({}, MENU[dow], (S.plan.menu||{})[dow]||{});
const startSun = () => {const s=parse(S.start);return addD(s,-s.getDay());};
const weekOf = d => Math.floor((parse(key(d)) - startSun())/(7*864e5))+1;
const clampW = w => Math.max(1,Math.min(12,w));
function phaseOf(w){ if(w<=4) return {n:1,name:"Adaptación"}; if(w<=8) return {n:2,name:"Volumen"}; return {n:3,name:"Intensidad"}; }
const isDeload = w => w===4||w===8;
function setsFor(base,w){let s=base; if(w<=4) s=Math.min(s,3); if(isDeload(w)) s=Math.ceil(s/2); return s;}
const m4 = d => !!(S.m4||{})[weekOf(d)];
function sessCode(d){const dow=d.getDay(); if(dow===4&&m4(d)) return null; return DAYSESS[dow];}
function runForD(d){
  const dow=d.getDay(), w=clampW(weekOf(d));
  if(m4(d)){ if(dow===4) return null;
    if(dow===0){const s=thuRun(w); return {title:s.length>1?"Series cortas":"Carrera corta",sub:"Semana de 4 días: al final de la sesión de piernas.",segs:s};} }
  return runFor(dow,w);
}
function tasksFor(d){const t=[]; if(sessCode(d)) t.push("e"); if(runForD(d)) t.push("r"); return t;}
const L = k => S.log[k] || {};
function dayStatus(d){
  const k=key(d), t=tasksFor(d), l=L(k);
  if(d < parse(S.start)) return "out";
  if(!t.length) return d<=TODAY ? "rest" : "future";
  if(t.every(x=>l[x])) return "done";
  if(d<TODAY) return "miss";
  return d.getTime()===TODAY.getTime() ? "pending" : "future";
}
function streak(){
  let n=0, d=new Date(TODAY);
  if(dayStatus(d)==="pending") d=addD(d,-1);
  const st=parse(S.start);
  while(d>=st){const s=dayStatus(d); if(s==="done"||s==="rest"){n++; d=addD(d,-1);} else break;}
  return n;
}
/* Repeticiones */
const repsOf = (l,id) => ((l.reps||{})[id]||[]);
const doneSets = (l,id) => repsOf(l,id).filter(v=>v!=null).length;
const maxOf = r => /máx/.test(r) ? null : +((r.match(/\d+/g)||[]).pop()||0) || null;
const minOf = r => +((r.match(/\d+/g)||[1])[0]);
const unitOf = r => / s\b/.test(r) ? "s" : "reps";
function lastFor(id, beforeKey){
  const ks=Object.keys(S.log).filter(k=>k<beforeKey).sort().reverse();
  for(const k of ks){const v=repsOf(S.log[k],id).filter(x=>x!=null); if(!v.length) continue;
    const d=parse(k), it=getSess(sessCode(d)||DAYSESS[d.getDay()]).find(x=>x[0]===id);
    return {k,vals:v,reps:it?it[2]:"",n:it?setsFor(it[1],clampW(weekOf(d))):v.length};}
  return null;
}
function readyUp(id,k){const L0=lastFor(id,k); if(!L0) return null; const mx=maxOf(L0.reps); if(!mx) return null;
  return L0.vals.length>=L0.n && L0.vals.every(v=>v>=mx) ? {mx,last:L0} : null;}

/* =================== GUARDADO =================== */
let dbRef=null, saving=false, again=false, synced=false;
function saveLocal(){try{localStorage.setItem(LSK,JSON.stringify(S));}catch(e){}}
async function save(){
  S.updated=Date.now(); const s=streak(); if(s>(S.best||0)) S.best=s;
  saveLocal();
  if(!dbRef) return;
  if(saving){again=true;return;}
  saving=true;
  try{ await dbRef.set(JSON.parse(JSON.stringify(S))); synced=true; }catch(e){ synced=false; }
  saving=false;
  if(again){again=false; save();}
}
// Sincronización con la cuenta de Claude (solo dentro de claude.ai)
(async()=>{
  try{
    if(!window.claude || !claude.use) return;
    const [db,user]=await Promise.all([claude.use("db"),claude.use("user")]);
    if(!db||!user) return;
    const id=await user.id(); if(!id) return;
    dbRef=db.collection("data/users/"+id).doc("cambio-fisico");
    const snap=await dbRef.get();
    if(snap.exists){const r=snap.data(); if((r.updated||0)>=(S.updated||0)){S=migrate(JSON.parse(JSON.stringify(r)));saveLocal();} else await save();}
    else if(Object.keys(S.log).length||S.onboarded) await save();
    synced=true; render(); maybeOnboard();
  }catch(e){}
})();

/* Mutación con celebración al completar el día */
function mutate(fn){
  const d=parse(ui.sel), before=dayStatus(d);
  fn(); save();
  const after=dayStatus(d);
  if(before!=="done" && after==="done"){
    hap(2); confetti();
    toast(d.getTime()===TODAY.getTime()?`Día completado · ${streak()} ${streak()===1?"día":"días"} de racha`:`${DNAME[d.getDay()]} completado`);
  }
}

/* =================== EFECTOS =================== */
let hapLabel=null;
function hap(n){
  try{ if(navigator.vibrate) navigator.vibrate(n>1?[14,50,14]:10); }catch(e){}
  try{ if(!hapLabel){hapLabel=document.createElement("label");hapLabel.setAttribute("aria-hidden","true");hapLabel.style.cssText="position:fixed;left:-200px;top:0;opacity:0;pointer-events:none";hapLabel.innerHTML='<input type="checkbox" switch tabindex="-1">';document.body.appendChild(hapLabel);}
    hapLabel.click(); if(n>1) setTimeout(()=>hapLabel.click(),90); }catch(e){}
}
function confetti(){
  if(RED) return;
  const c=document.createElement("canvas"); c.className="fx"; document.body.appendChild(c);
  const dpr=Math.min(2,devicePixelRatio||1), W=innerWidth, H=innerHeight; c.width=W*dpr; c.height=H*dpr;
  const x=c.getContext("2d"); x.scale(dpr,dpr);
  const cs=getComputedStyle(document.documentElement), cols=["--ej","--run","--food","--streak"].map(v=>cs.getPropertyValue(v).trim()||"#fff");
  const ps=Array.from({length:110},(_,i)=>({x:W/2+(Math.random()-.5)*60,y:H*.38,vx:(Math.random()-.5)*11,vy:-Math.random()*11-4,r:Math.random()*360,vr:(Math.random()-.5)*14,s:6+Math.random()*6,c:cols[i%4]}));
  let t=0;(function f(){x.clearRect(0,0,W,H);
    ps.forEach(p=>{p.vy+=.32;p.x+=p.vx;p.y+=p.vy;p.vx*=.985;p.r+=p.vr;x.save();x.globalAlpha=Math.max(0,1-t/120);x.translate(p.x,p.y);x.rotate(p.r*Math.PI/180);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);x.restore();});
    if(++t<120) requestAnimationFrame(f); else c.remove();})();
}
let toastT;
function toast(msg,action){
  const el=$("#toast"); el.innerHTML=esc(msg)+(action?` <button id="toastAct">${esc(action.label)}</button>`:"");
  el.classList.add("show"); clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove("show"),action?8000:2600);
  if(action) $("#toastAct").onclick=()=>{el.classList.remove("show");action.fn();};
}

/* =================== HOJA INFERIOR =================== */
let sheetCleanup=[];
function onSheetClose(fn){sheetCleanup.push(fn);}
function openSheet(html){
  const sh=$("#sheet"),sc=$("#scrim"), first=sh.hidden;
  sheetCleanup.forEach(f=>{try{f();}catch(e){}}); sheetCleanup=[];
  $("#sheetIn").innerHTML='<div class="grabzone"><div class="grab"></div></div>'+html;
  if(first){sh.hidden=false;sc.hidden=false;requestAnimationFrame(()=>{sh.classList.add("show");sc.classList.add("show");});}
  sh.scrollTop=0; bindDrag();
}
function closeSheet(){
  const sh=$("#sheet"),sc=$("#scrim");
  sheetCleanup.forEach(f=>{try{f();}catch(e){}}); sheetCleanup=[];
  sh.style.transform=""; sh.classList.remove("show","drag"); sc.classList.remove("show"); sc.style.opacity="";
  setTimeout(()=>{if(!sh.classList.contains("show")){sh.hidden=true;sc.hidden=true;}},320); render();
}
$("#scrim").onclick=closeSheet;
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#sheet").hidden) closeSheet();});
// Deslizar hacia abajo para cerrar
function bindDrag(){
  const sh=$("#sheet"), sc=$("#scrim"); let y0=null,dy=0,t0=0,active=false;
  const start=(y,force)=>{ if(!force && sh.scrollTop>0) return; y0=y; dy=0; t0=performance.now(); active=false; };
  const move=(y,e)=>{ if(y0==null) return; dy=y-y0; if(!active){ if(dy>6){active=true; sh.classList.add("drag");} else if(dy<-4){y0=null;return;} else return; }
    if(e&&e.cancelable) e.preventDefault(); sh.style.transform=`translateY(${Math.max(0,dy)}px)`; sc.style.opacity=String(Math.max(0,1-dy/400)); };
  const end=()=>{ if(y0==null) return; const v=dy/Math.max(1,performance.now()-t0); sh.classList.remove("drag");
    if(active && (dy>120||v>.6)) closeSheet(); else {sh.style.transform=""; sc.style.opacity="";} y0=null; active=false; };
  sh.ontouchstart=e=>start(e.touches[0].clientY, !!e.target.closest(".grabzone"));
  sh.ontouchmove=e=>move(e.touches[0].clientY,e);
  sh.ontouchend=end; sh.ontouchcancel=end;
  const gz=sh.querySelector(".grabzone");
  if(gz) gz.onpointerdown=e=>{ if(e.pointerType==="touch") return; start(e.clientY,true); const mv=ev=>move(ev.clientY); const up=()=>{end();removeEventListener("pointermove",mv);removeEventListener("pointerup",up);}; addEventListener("pointermove",mv); addEventListener("pointerup",up); };
}

/* =================== RENDER =================== */
function greet(){const h=new Date().getHours(); const g=h<6?"Buenas noches":h<14?"Buenos días":h<21?"Buenas tardes":"Buenas noches"; return g+(S.name?", "+S.name:"");}
function render(){
  TODAY=today();
  document.body.dataset.tab=ui.tab;
  const sel=parse(ui.sel), w=weekOf(sel), cw=clampW(w), ph=phaseOf(cw), isT=ui.sel===key(TODAY);
  $("#mk").innerHTML=LOGO;
  $("#hi").textContent=greet()+" · "+DNAME[TODAY.getDay()].toLowerCase()+" "+fdate(TODAY);
  $("#dayTitle").textContent=isT?"Hoy":DNAME[sel.getDay()]+" "+sel.getDate();
  const tw=weekOf(TODAY), dayN=Math.round((TODAY-startSun())/864e5)+1, pct=Math.max(0,Math.min(100,Math.round(dayN/84*100)));
  $("#phase").innerHTML = tw<1 ? "Empiezas el "+fdate(parse(S.start)) : tw>12 ? "<b>Plan completado</b> · 12 de 12 semanas" : `<b>Semana ${tw} de 12</b> · Fase ${phaseOf(tw).n} ${phaseOf(tw).name}${isDeload(tw)?" · Descarga":""}`;
  $("#phasePct").textContent=pct+" %"; $("#pbar").style.width=pct+"%";
  const st=streak(); $("#streakN").textContent=st; $("#streak").classList.toggle("hot",st>=3);
  const ws=addD(sel,-sel.getDay());
  $("#weekLbl").innerHTML = (w>=1&&w<=12?"Semana "+w:"Fuera del plan")+' <em>· '+fdate(ws)+" – "+fdate(addD(ws,6))+"</em>"+(isT?"":' <button class="todayb" id="goToday">Hoy</button>');
  $("#prevW").disabled = w<=1; $("#nextW").disabled = w>=12;
  let h="";
  for(let i=0;i<7;i++){const d=addD(ws,i),k=key(d),s=dayStatus(d);
    const cls=["day",s==="done"?"done":"",s==="rest"?"rest":"",s==="miss"?"miss":"",s==="out"?"out":"",k===key(TODAY)?"today":"",k===ui.sel?"sel":""].join(" ");
    h+=`<button class="${cls}" data-k="${k}" aria-label="${DNAME[i]} ${d.getDate()}"><span class="dl">${DL[i]}</span><span class="dn">${d.getDate()}</span><span class="dot">${s==="done"?CHECK:""}</span></button>`;}
  $("#days").innerHTML=h;
  $$(".day").forEach(b=>b.onclick=()=>{ui.sel=b.dataset.k;hap();render();});
  const gt=$("#goToday"); if(gt) gt.onclick=()=>{ui.sel=key(TODAY);render();};
  const l=L(ui.sel);
  $$("nav.tabs button").forEach(b=>{b.classList.toggle("on",b.dataset.t===ui.tab);
    const t=b.dataset.t; b.classList.toggle("ok", t==="ej"?!!l.e : t==="run"?!!l.r : t==="food"?(l.m||[]).filter(Boolean).length===4 : false);});
  $("#main").innerHTML = ui.tab==="ej"?viewEj(sel,cw):ui.tab==="run"?viewRun(sel,cw):ui.tab==="food"?viewFood(sel):viewProg(sel);
  bindMain();
}
function doneBtn(on,label,id){return `<button class="cta ${on?"on":""}" id="${id}">${on?CHECK+" Completado":label}</button>`;}
function linkList(arr){return arr.map(([t,q])=>`<li>${q?`<a href="${TT(q)}" target="_blank" rel="noopener">${esc(t)}</a>`:esc(t)}</li>`).join("");}
const figOf = id => FIG.P[id] ? FIG.svg(FIG.P[id],1) : "";

/* ---------- Ejercicio ---------- */
function viewEj(d,w){
  const dow=d.getDay(), code=sessCode(d), l=L(key(d));
  if(!code){
    return `<div class="hero"><span class="tag">${DNAME[dow]} · Descanso</span><h2>Día de descanso</h2><p>${dow===4?"Semana de 4 días: hoy no hay sesión D. La carrera corta pasó al domingo.":"Viernes y sábado son tus días de doble trabajo. Hoy no toca entrenar y la racha sigue."}</p></div>
    ${dow===6?`<section><h3>Movilidad opcional <small>15 min antes de dormir</small></h3><div class="plain"><ol>${linkList(MOB)}</ol></div></section>`:""}
    <div class="note"><b>Descanso:</b> duerme 7,5-8 h, a la misma hora cada día y sin pantallas 30 min antes. Es donde se construye el músculo.</div>`;
  }
  if(code==="MOB"){
    return `<div class="hero"><span class="tag">${DNAME[dow]} · Calle</span><h2>Carrera + movilidad</h2><p>Hoy la sesión fuerte es la carrera (pestaña Running). Al volver, 15 min de movilidad.</p>
      <div class="stats"><div class="stat"><div class="v">15</div><div class="k">min</div></div><div class="stat"><div class="v">7</div><div class="k">ejercicios</div></div></div>
      ${doneBtn(l.e,"Marcar movilidad hecha","doneE")}</div>
      <section><h3>Movilidad <small>toca para ver vídeos</small></h3><div class="plain"><ol>${linkList(MOB)}</ol></div></section>`;
  }
  const s=SESS[code], items=getSess(code), sets=items.reduce((a,it)=>a+setsFor(it[1],w),0), k=key(d);
  const doneN=items.reduce((a,it)=>a+Math.min(doneSets(l,it[0]),setsFor(it[1],w)),0);
  const cards=items.map(([id,b,reps,rest],i)=>{const e=EX[id]||{n:id},n=setsFor(b,w),rv=repsOf(l,id), up=readyUp(id,k), full=doneSets(l,id)>=n;
    let bars="";for(let j=0;j<n;j++)bars+=`<i class="${rv[j]!=null?"on":""}"></i>`;
    return `<button class="ex ${full?"full":""}" data-i="${i}"><div class="ph">${figOf(id)}</div><div style="min-width:0;display:flex;flex-direction:column"><div class="nm">${esc(e.n)}</div><div class="mt"><b>${n} × ${esc(reps)}</b> · ${rest>=120?rest/60+" min":rest+" s"}</div>${rv.some(v=>v!=null)?`<div class="mt">Hoy: ${rv.map(v=>v==null?"–":v).join(" · ")}</div>`:""}<div class="sets">${bars}</div>${up&&!full?'<span class="up">▲ Sube de nivel</span>':""}</div>${CHEV}</button>`;}).join("");
  const msg=isDeload(w)?'<p><b>Semana de descarga:</b> la mitad de series. Recupera.</p>':w<=4?'<p>Fase de adaptación: máximo 3 series por ejercicio. Técnica perfecta.</p>':w>=9?'<p>Fase de intensidad: más peso en la mochila y última serie casi al fallo.</p>':'<p>Fase de volumen: series completas y variantes más difíciles.</p>';
  return `<div class="hero"><span class="tag">${DNAME[dow]} · Sesión ${code} · ${esc(s.place)}</span><h2>${esc(s.name)}</h2>
    <div class="stats"><div class="stat"><div class="v">60</div><div class="k">min</div></div><div class="stat"><div class="v">${items.length}</div><div class="k">ejercicios</div></div><div class="stat"><div class="v">${doneN}/${sets}</div><div class="k">series</div></div></div>
    <div class="bar"><i style="width:${sets?doneN/sets*100:0}%"></i></div>
    ${msg}
    ${doneBtn(l.e,"Marcar entreno completado","doneE")}</div>
    <section><h3>Calentamiento <small>10 min</small></h3><div class="plain"><ol>${linkList(WARM)}</ol></div></section>
    <section><h3>Bloque principal <small>toca un ejercicio</small></h3><div class="list">${cards}</div></section>
    <div class="note"><b>Hombro derecho:</b> ${SHOULDER}</div>
    <section><h3>Estiramientos <small>30 s cada uno</small></h3><div class="plain"><ul>${linkList(STRETCH)}</ul></div></section>`;
}
function openEx(i){
  const d=parse(ui.sel), w=clampW(weekOf(d)), code=sessCode(d), items=getSess(code);
  const [id,b,reps,rest]=items[i], e=EX[id]||{n:id,how:[],q:id}, n=setsFor(b,w);
  const last=lastFor(id,ui.sel), up=readyUp(id,ui.sel), unit=unitOf(reps), step=unit==="s"?5:1;
  const draft=[]; for(let j=0;j<n;j++){const cur=repsOf(L(ui.sel),id)[j]; draft[j]=cur!=null?cur:(last&&last.vals[j]!=null?last.vals[j]:minOf(reps));}
  openSheet(`<div class="anim" id="anim"></div>
    <div><div class="eyebrow">Sesión ${code} · ejercicio ${i+1} de ${items.length}</div><h2>${esc(e.n)}</h2></div>
    <div class="chips"><span class="chip a">${n} series</span><span class="chip a">${esc(reps)} ${unit==="s"?"":"reps"}</span><span class="chip">Descanso ${rest>=120?rest/60+" min":rest+" s"}</span></div>
    <div><div class="eyebrow" style="margin-bottom:8px">Cómo se hace</div><ol class="how">${e.how.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div>
    ${up?`<div class="banner"><b>▲ Toca subir de nivel</b>La última vez hiciste ${up.last.vals.join(" · ")}: todas las series al máximo (${up.mx}). ${e.prog?"Pasa a la variante siguiente: "+esc(e.prog)+".":"Añade 2-3 kg a la mochila o baja más lento."}</div>`
      :e.prog?`<div class="note"><b>Progresión:</b> ${esc(e.prog)}. Cuando hagas el máximo de reps en todas las series, sube de variante o añade 2-3 kg a la mochila.</div>`:""}
    <div><div class="eyebrow" style="margin-bottom:8px">Apunta tus ${unit==="s"?"segundos":"repeticiones"} y marca cada serie</div><div class="setrows" id="bubs"></div></div>
    <div class="timer" id="timerBox"><div class="fill" id="tfill"></div><div><div class="eyebrow">Descanso</div><div class="tv" id="tv">${fmtT(rest)}</div></div><button class="btn p" id="restBtn">Iniciar</button></div>
    <div class="row2"><a class="btn" href="${TT(e.q)}" target="_blank" rel="noopener">▶ Vídeos reales</a><button class="btn" id="closeS">Cerrar</button>${i<items.length-1?'<button class="btn p" id="nextEx">Siguiente →</button>':""}</div>`);
  if(FIG.P[id]){const stop=FIG.play($("#anim"),FIG.P[id]); onSheetClose(stop);}
  const write=(j,val)=>mutate(()=>{const L2=(S.log[ui.sel]=S.log[ui.sel]||{}); L2.reps=Object.assign({},L2.reps); const a=(L2.reps[id]||[]).slice(); while(a.length<n) a.push(null); a[j]=val; L2.reps[id]=a;
      if(items.every(it=>doneSets(L2,it[0])>=setsFor(it[1],w))) L2.e=1;});
  const draw=()=>{const rv=repsOf(L(ui.sel),id); let h="";
    for(let j=0;j<n;j++){const on=rv[j]!=null, v=on?rv[j]:draft[j];
      h+=`<div class="setrow ${on?"on":""}"><div class="sl">Serie ${j+1}<small>${last&&last.vals[j]!=null?"Última vez: "+last.vals[j]+" "+unit:"Objetivo: "+esc(reps)}</small></div>
      <div class="stepper"><button data-dec="${j}" aria-label="Menos">−</button><output>${v}</output><button data-inc="${j}" aria-label="Más">+</button></div>
      <button class="check big ${on?"on":""}" data-set="${j}" aria-label="Serie ${j+1} hecha">${CHECK}</button></div>`;}
    $("#bubs").innerHTML=h;
    $$("[data-dec],[data-inc]").forEach(bb=>bb.onclick=()=>{const j=+(bb.dataset.dec??bb.dataset.inc), dlt=bb.dataset.dec!=null?-step:step;
      const rv2=repsOf(L(ui.sel),id); const base=rv2[j]!=null?rv2[j]:draft[j]; const nv=Math.max(0,base+dlt); draft[j]=nv; hap(); if(rv2[j]!=null) write(j,nv); draw();});
    $$("[data-set]").forEach(bb=>bb.onclick=()=>{const j=+bb.dataset.set, rv2=repsOf(L(ui.sel),id); hap();
      if(rv2[j]!=null){draft[j]=rv2[j]; write(j,null);} else {write(j,draft[j]); if(j<n-1 || i<items.length-1) startRest();}
      draw();});};
  draw();
  let restT=null, endAt=0;
  function stopRest(){clearInterval(restT);restT=null;$("#restBtn").textContent="Iniciar";$("#tv").textContent=fmtT(rest);$("#tfill").style.transform="scaleX(0)";}
  function startRest(){clearInterval(restT); endAt=Date.now()+rest*1000; $("#restBtn").textContent="Parar";
    const tick=()=>{const left=Math.max(0,Math.ceil((endAt-Date.now())/1000)); if(!$("#tv")){clearInterval(restT);return;}
      $("#tv").textContent=left?fmtT(left):"¡Vamos!"; $("#tfill").style.transform=`scaleX(${1-left/rest})`;
      if(!left){clearInterval(restT);restT=null;$("#restBtn").textContent="Iniciar";hap(2);beep(880,.15);}};
    tick(); restT=setInterval(tick,250);}
  onSheetClose(()=>clearInterval(restT));
  $("#restBtn").onclick=()=>{ unlockAudio(); restT?stopRest():startRest(); };
  $("#closeS").onclick=closeSheet;
  const nx=$("#nextEx"); if(nx) nx.onclick=()=>openEx(i+1);
}

/* ---------- Running ---------- */
function viewRun(d,w){
  const dow=d.getDay(), r=runForD(d), l=L(key(d));
  const table=`<section><h3>Plan de carrera <small>12 semanas</small></h3><div class="plain tscroll"><table class="weektable"><tr><th>Sem.</th><th>Miércoles</th><th>Jueves</th></tr>${WED.map((v,i)=>{const t=thuRun(i+1);const ts=t.length>1?`5' + ${(t.length-1)/2} × (${t[1].t}' / ${t[2].t}')`:t[0].t+" min suave";return `<tr class="${i+1===w?"cur":""}"><td>${i+1}${i===3||i===7?" ↓":""}</td><td>${v==="test"?"Test 5 km":v+" min suave"}</td><td>${ts}</td></tr>`;}).join("")}</table></div></section>
    <div class="note"><b>Ritmo suave:</b> puedes hablar en frases completas. <b>Rápido:</b> solo puedes decir 2-3 palabras. ↓ = semana de descarga.</div>`;
  if(!r) return `<div class="hero"><span class="tag">${DNAME[dow]}</span><h2>Hoy no toca correr</h2><p>${dow===0?"Domingo es día de piernas. Descansa las piernas para correr mañana.":dow===4?"Semana de 4 días: la carrera de hoy pasó al domingo.":"Día de descanso."}</p></div>`+table;
  const st=runStats(r), tot=r.segs.reduce((a,s)=>a+s.t,0);
  const bar=r.segs.map(s=>`<div class="seg-${s.k}" style="flex:${s.t}"></div>`).join("");
  let steps=[]; if(r.segs.length>1){const reps=(r.segs.length-1)/2;
    steps.push({n:"1",t:"Calentamiento",d:"Trote suave · "+fmtPace(PACE.suave)+" /km",r:r.segs[0].t+"'"});
    steps.push({n:reps+"×",t:r.segs[1].t+"' rápido",d:fmtPace(PACE.rapido)+" /km · 2-3 palabras",r:r.segs[1].t*reps+"'"});
    steps.push({n:reps+"×",t:r.segs[2].t+"' trote de recuperación",d:fmtPace(PACE.trote)+" /km · muy suave",r:r.segs[2].t*reps+"'"});}
  else steps.push({n:"1",t:r.test?"5 km a tope":"Carrera continua suave",d:r.test?"Ritmo constante, acelera el último km":fmtPace(PACE.suave)+" /km · ritmo de conversación",r:r.test?"5 km":(r.range?r.range+"'":tot+"'")});
  return `<div class="hero"><span class="tag">${DNAME[dow]} · Semana ${w}</span><h2>${esc(r.title)}</h2><p>${esc(r.sub)}</p>
    <div class="runhero"><div class="big"><span class="v">${r.range||st.min}<small>min</small></span><span class="k">Tiempo</span></div><div class="big"><span class="v">${st.km}<small>km</small></span><span class="k">Distancia aprox.</span></div><div class="big"><span class="v">${st.pace}</span><span class="k">Ritmo /km</span></div></div>
    <div class="segbar" aria-hidden="true">${bar}</div>
    <div class="legend"><span><i class="seg-suave"></i>Suave</span>${r.segs.length>1?'<span><i class="seg-rapido"></i>Rápido</span><span><i class="seg-trote"></i>Trote</span>':""}</div>
    ${l.r?"":`<button class="cta" id="goRun"><svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5v14l11-7z"/></svg>${r.test?"Empezar cronómetro":"Empezar carrera guiada"}</button>`}
    ${doneBtn(l.r,"Marcar como hecha","doneR").replace('class="cta ','class="cta '+(l.r?"":"ghost "))}</div>
    <section><h3>Cómo se hace</h3><div class="plain">${steps.map(s=>`<div class="step"><div class="n">${s.n}</div><div><div class="t">${esc(s.t)}</div><div class="d">${esc(s.d)}</div></div><div class="r">${esc(s.r)}</div></div>`).join("")}</div></section>
    <div class="note">La carrera guiada te avisa con voz y vibración en cada cambio de ritmo, y mantiene la pantalla encendida. Los km son una estimación a tu ritmo actual. <a href="${TT("tecnica de carrera principiantes")}" target="_blank" rel="noopener">Vídeos de técnica</a>.</div>`+table;
}
/* Audio y voz */
let actx=null;
function unlockAudio(){try{if(!actx){const A=window.AudioContext||window.webkitAudioContext; if(A) actx=new A();} if(actx&&actx.state==="suspended") actx.resume();}catch(e){}}
function beep(f,d){try{if(!actx) return; const o=actx.createOscillator(),g=actx.createGain();o.frequency.value=f;o.connect(g);g.connect(actx.destination);g.gain.setValueAtTime(.0001,actx.currentTime);g.gain.exponentialRampToValueAtTime(.3,actx.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+d);o.start();o.stop(actx.currentTime+d+.02);}catch(e){}}
function say(t){try{if(!S.voice||!window.speechSynthesis) return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang="es-ES"; u.rate=1.02; speechSynthesis.speak(u);}catch(e){}}
function openRun(){
  const d=parse(ui.sel), r=runForD(d); if(!r) return;
  const segs=r.test?null:r.segs, total=segs?segs.reduce((a,s)=>a+s.t*60,0):0;
  let state="ready", t0=0, acc=0, tm=null, lastIdx=-1, wake=null;
  const elapsed=()=>acc+(state==="run"?(Date.now()-t0)/1000:0);
  const segAt=e=>{let c=0; for(let i=0;i<segs.length;i++){c+=segs[i].t*60; if(e<c) return {i,left:c-e};} return {i:segs.length,left:0};};
  openSheet(`<div><div class="eyebrow">${DNAME[d.getDay()]} · Semana ${clampW(weekOf(d))}</div><h2>${esc(r.title)}</h2></div>
    <div class="card runtimer"><div class="ph2" id="rph">${r.test?"Cronómetro":"Preparado"}</div><div class="clock" id="rclock">${r.test?"0:00":fmtT(total)}</div><div class="eyebrow" id="rsub">${r.test?"5 km al máximo ritmo":"Tiempo restante"}</div>
    ${segs?`<div class="segbar" style="width:100%">${segs.map((s,i)=>`<div class="seg-${s.k}" data-sg="${i}" style="flex:${s.t};opacity:.45"></div>`).join("")}</div>`:""}</div>
    <div class="row2"><button class="cta" id="rgo" style="flex:1">Empezar</button></div>
    <div class="switch"><span>Avisos por voz</span><button class="tg ${S.voice?"on":""}" id="rvoice" role="switch" aria-checked="${!!S.voice}" aria-label="Avisos por voz"></button></div>
    <div class="row2"><button class="btn" id="rfin">Terminar y marcar hecha</button><button class="btn" id="closeS">Cerrar</button></div>`);
  const ui2=()=>{const e=elapsed();
    if(!segs){$("#rclock").textContent=fmtT(Math.floor(e));return;}
    const s=segAt(e);
    if(s.i>=segs.length){ $("#rclock").textContent="0:00"; $("#rph").textContent="¡Terminado!"; finish(true); return; }
    $("#rclock").textContent=fmtT(Math.ceil(total-e)); $("#rph").textContent=PNAME[segs[s.i].k]+" · "+fmtT(Math.ceil(s.left));
    $("#rsub").textContent=`Tramo ${s.i+1} de ${segs.length} · ritmo ${fmtPace(PACE[segs[s.i].k])} /km`;
    $$("[data-sg]").forEach(x=>x.style.opacity=+x.dataset.sg<s.i?"1":+x.dataset.sg===s.i?"1":".45");
    if(s.i!==lastIdx){ if(lastIdx>=0||state==="run"){hap(2); beep(segs[s.i].k==="rapido"?988:660,.25); say(`${PNAME[segs[s.i].k]}. ${segs[s.i].t} ${segs[s.i].t===1?"minuto":"minutos"}`);} lastIdx=s.i; }
  };
  async function lock(){try{ if(navigator.wakeLock) wake=await navigator.wakeLock.request("screen"); }catch(e){}}
  function finish(auto){ if(state==="done") return; state="done"; clearInterval(tm); try{wake&&wake.release();}catch(e){}
    if(auto) say("Carrera completada. Buen trabajo.");
    mutate(()=>{const l=(S.log[ui.sel]=S.log[ui.sel]||{}); l.r=1;}); closeSheet(); }
  $("#rgo").onclick=()=>{unlockAudio(); hap();
    if(state==="run"){acc=elapsed(); state="pause"; clearInterval(tm); $("#rgo").textContent="Seguir"; return;}
    if(state==="ready"&&segs){say(`Empezamos. ${PNAME[segs[0].k]}, ${segs[0].t} minutos.`); lastIdx=0;}
    state="run"; t0=Date.now(); $("#rgo").textContent="Pausa"; lock(); tm=setInterval(ui2,250); ui2();};
  $("#rvoice").onclick=()=>{S.voice=!S.voice; save(); $("#rvoice").classList.toggle("on",S.voice);};
  $("#rfin").onclick=()=>finish(false);
  $("#closeS").onclick=closeSheet;
  onSheetClose(()=>{clearInterval(tm); try{wake&&wake.release();}catch(e){} try{speechSynthesis.cancel();}catch(e){}});
  const vis=()=>{ if(document.visibilityState==="visible"&&state==="run") lock(); }; document.addEventListener("visibilitychange",vis); onSheetClose(()=>document.removeEventListener("visibilitychange",vis));
}

/* ---------- Comida ---------- */
const adjSum = () => (S.adj||[]).reduce((a,x)=>a+x.kcal,0);
const kcalTarget = () => 2400 + adjSum();
function viewFood(d){
  const dow=d.getDay(), M=getMenu(dow), l=L(key(d)), done=l.m||[0,0,0,0];
  let kT=0,kD=0,pD=0;
  MEALS.forEach(([s],i)=>{const r=R[M[s]]; if(r&&r.kcal){kT+=r.kcal; if(done[i]){kD+=r.kcal;pD+=r.p;}}});
  const TGT=kcalTarget(), C=2*Math.PI*50, frac=Math.min(1,kD/TGT), adj=S.adj||[];
  const cards=MEALS.map(([s,time,label],i)=>{const r=R[M[s]]||R.libre, open=ui.open[i], on=!!done[i];
    let body="";
    if(open){
      if(r.ing){const two=r.batch&&ui.two;
        body+=(r.batch?`<div class="toggle" role="group"><button data-two="0" class="${!two?"on":""}">1 ración</button><button data-two="1" class="${two?"on":""}">Para 2 (táper)</button></div>`:"");
        body+=`<table class="ing"><tr><th>Ingrediente</th><th>${two?"2 raciones":"Cantidad"}</th></tr>${r.ing.map(x=>`<tr><td>${esc(x[0])}</td><td>${esc(two?(x[2]||x[1]):x[1])}</td></tr>`).join("")}</table>`;}
      if(r.combos) body+=`<table class="ing"><tr><th>Combo rápido</th><th>Coste</th></tr>${r.combos.map(x=>`<tr><td>${esc(x[0])}</td><td>${esc(x[1])}</td></tr>`).join("")}</table>`;
      body+=`<div><div class="eyebrow" style="margin-bottom:6px">Preparación</div><ol class="prep">${r.prep.map(p=>`<li>${esc(p)}</li>`).join("")}</ol></div>`;
      if(r.min) body+=`<div class="chips"><span class="chip">${r.min} min</span>${r.kcal?`<span class="chip a">${r.approx?"≈":""}${r.kcal} kcal</span><span class="chip a">${r.approx?"≥25":r.p} g proteína</span>`:""}</div>`;
      body=`<div class="bd">${body}</div>`;
    }
    return `<div class="meal"><div class="hd"><span class="time">${time}</span><button data-open="${i}" style="text-align:left;min-width:0"><div class="eyebrow">${label}</div><div class="ttl">${esc(r.n)}</div><div class="kc">${r.kcal?(r.approx?"≈":"")+r.kcal+" kcal · "+(r.approx?"≥25":r.p)+" g proteína":"Sin contar"} · ${open?"ocultar":"ver receta"}</div></button><button class="check ${on?"on":""}" data-meal="${i}" aria-label="Marcar ${label}">${CHECK}</button></div>${body}</div>`;}).join("");
  return `<div class="hero"><span class="tag">${DNAME[dow]}${dow>=5?" · Táper":""}</span>
    <div class="rings"><div class="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="none" stroke="var(--surface2)" stroke-width="12"/><circle cx="60" cy="60" r="50" fill="none" stroke="var(--food)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-frac)}"/></svg><div class="c"><b>${miles(kD)}</b><span>de ${miles(TGT)} kcal</span></div></div>
    <div class="macros"><div class="macro"><div class="row"><span>Proteína</span><b>${pD} / 140 g</b></div><div class="bar"><i style="width:${Math.min(100,pD/140*100)}%"></i></div></div>
    <div class="macro"><div class="row"><span>Comidas</span><b>${done.filter(Boolean).length} / 4</b></div><div class="bar"><i style="width:${done.filter(Boolean).length*25}%"></i></div></div>
    <div class="macro"><div class="row"><span>Plan de hoy</span><b>${miles(kT)} kcal</b></div></div></div></div></div>
    ${adj.length?`<div class="banner g"><b>Ajuste activo: ${adjSum()>0?"+":""}${adjSum()} kcal al día</b>${adj.map(a=>esc(a.txt)).join(" ")}</div>`:""}
    <button class="rowbtn" id="openShop"><span>🛒 Lista de la compra</span><span>${shopDone()}/${SHOP.length} · ≈44 €</span></button>
    ${COOK[dow]?`<div class="note"><b>Hoy cocinas.</b> ${esc(COOK[dow])} Táperes: máximo 3-4 días en nevera.</div>`:""}
    <section><h3>Menú de hoy <small>pesa todo en crudo</small></h3><div class="list">${cards}</div></section>
    <div class="note"><b>Agua:</b> 2,5-3 L al día, más los días de carrera. <b>Merienda</b> 1 h 30 antes de entrenar; si no puedes, al menos un plátano.</div>`;
}
const shopKey = () => {const s=parse(ui.sel);return key(addD(s,-s.getDay()));};
const shopDone = () => ((S.shop||{})[shopKey()]||[]).length;
function openShop(){
  const wk=shopKey(), got=new Set((S.shop||{})[wk]||[]);
  openSheet(`<div><div class="eyebrow">Semana del ${fdate(parse(wk))}</div><h2>Lista de la compra</h2></div>
    <div class="plain shop"><ul>${SHOP.map((x,i)=>`<li class="${got.has(i)?"on":""}"><button class="check ${got.has(i)?"on":""}" data-sh="${i}" aria-label="Marcar ${esc(x[0])}">${CHECK}</button><div><div class="nm">${esc(x[0])}</div><div class="q">${esc(x[1])}</div></div><span class="pr">${x[2]}</span></li>`).join("")}</ul></div>
    <div class="note"><b>Total ≈ 44 € por semana</b> (precios de Mercadona). Báscula de cocina: unos 10 €, una sola vez.</div>
    <div class="note"><b>Modo ahorro (≈38 €):</b> huevos en Carrefour (docena M a 2,60 €), pollo entero a ≈3,50 €/kg en vez de pechuga, lentejas secas en vez de bote y fruta de temporada a granel.</div>
    <div class="row2"><button class="btn" id="closeS">Cerrar</button></div>`);
  $("#closeS").onclick=closeSheet;
  $$("[data-sh]").forEach(b=>b.onclick=()=>{const i=+b.dataset.sh; hap(); S.shop=Object.assign({},S.shop); const a=new Set(S.shop[wk]||[]); a.has(i)?a.delete(i):a.add(i); S.shop[wk]=[...a]; save();
    b.classList.toggle("on",a.has(i)); b.closest("li").classList.toggle("on",a.has(i)); if(a.size===SHOP.length) toast("Compra hecha 🛒");});
}

/* ---------- Progreso ---------- */
function measList(){return Object.entries(S.meas||{}).map(([k,v])=>({k,d:parse(k),kg:v.kg,cm:v.cm})).sort((a,b)=>a.k<b.k?-1:1);}
function dietAdvice(){
  const m=measList().filter(x=>x.kg!=null);
  if(m.length<2) return {state:"wait",txt:`Necesitas al menos 2 semanas de pesajes. Llevas ${m.length}.`};
  const last=m[m.length-1], prev=[...m].reverse().find(x=>(last.d-x.d)/864e5>=13);
  if(!prev) return {state:"wait",txt:"Aún no hay 2 semanas entre tu primer pesaje y el último."};
  const wk=(last.d-prev.d)/(7*864e5), rate=(prev.kg-last.kg)/wk, cmDown=last.cm!=null&&prev.cm!=null&&last.cm<prev.cm;
  const r=dec(rate.toFixed(2)), already=(S.adj||[]).some(a=>a.from===last.k);
  let o;
  if(rate>0.7) o={state:"adj",kcal:200,txt:`Bajas ${r} kg/semana: demasiado rápido, pierdes músculo.`,act:"Añade 50 g de arroz al día (+200 kcal)."};
  else if(rate>0.5) o={state:"ok",txt:`Bajas ${r} kg/semana: algo rápido pero aceptable. Seguimos igual y vigilamos el próximo lunes.`};
  else if(rate>=0.25) o={state:"ok",txt:`Bajas ${r} kg/semana: ritmo ideal. Seguimos igual.`};
  else if(rate<=0 && !cmDown) o={state:"adj",kcal:-150,txt:`No bajas ni peso ni cintura (${r} kg/semana).`,act:"Quita la crema de cacahuete y 20 g de avena (−150 kcal)."};
  else o={state:"ok",txt:cmDown?`Bajas ${r} kg/semana pero la cintura baja: estás ganando músculo. Seguimos igual.`:`Bajas ${r} kg/semana. Ritmo aceptable: seguimos igual.`};
  o.from=last.k; o.already=already; return o;
}
function chart(points,unit){
  if(!points.length) return `<div class="chart"><div class="empty">Aún no hay datos. Apunta tu primer pesaje arriba.</div></div>`;
  const W=340,H=150,pl=38,pr=34,pt=14,pb=24;
  const xs=points.map(p=>p.d.getTime()), ys=points.map(p=>p.v);
  let y0=Math.min(...ys), y1=Math.max(...ys); const padY=Math.max(0.5,(y1-y0)*0.25); y0=Math.floor(y0-padY); y1=Math.ceil(y1+padY);
  const x0=Math.min(...xs), x1=Math.max(...xs)===x0?x0+7*864e5:Math.max(...xs);
  const X=t=>pl+(t-x0)/(x1-x0)*(W-pl-pr), Y=v=>pt+(1-(v-y0)/(y1-y0))*(H-pt-pb);
  const fmt=v=>dec(Math.round(v*10)/10);
  let g=[y0,(y0+y1)/2,y1].map(t=>`<line x1="${pl}" x2="${W-pr}" y1="${Y(t)}" y2="${Y(t)}" stroke="var(--line)" stroke-width="1"/><text x="${pl-6}" y="${Y(t)+4}" text-anchor="end" font-size="10" fill="var(--muted)">${fmt(t)}</text>`).join("");
  const first=points[0], last=points[points.length-1];
  g+=`<text x="${X(first.d.getTime())}" y="${H-6}" font-size="10" fill="var(--muted)" text-anchor="${points.length>1?"start":"middle"}">${fdate(first.d)}</text>`;
  if(points.length>1) g+=`<text x="${X(last.d.getTime())}" y="${H-6}" font-size="10" fill="var(--muted)" text-anchor="end">${fdate(last.d)}</text>`;
  const path=points.map((p,i)=>(i?"L":"M")+X(p.d.getTime()).toFixed(1)+" "+Y(p.v).toFixed(1)).join(" ");
  const area=points.length>1?`<path d="${path} L${X(last.d.getTime()).toFixed(1)} ${H-pb} L${X(first.d.getTime()).toFixed(1)} ${H-pb} Z" fill="var(--acc)" opacity=".12"/>`:"";
  const dots=points.map(p=>`<circle cx="${X(p.d.getTime())}" cy="${Y(p.v)}" r="4" fill="var(--acc)" stroke="var(--surface)" stroke-width="2"/>`).join("");
  const lbl=`<text x="${X(last.d.getTime())+8}" y="${Y(last.v)+4}" font-size="12" font-weight="700" fill="var(--fg)">${fmt(last.v)}</text>`;
  const data=esc(JSON.stringify(points.map(p=>[X(p.d.getTime()),Y(p.v),`${fdate(p.d)} · ${fmt(p.v)} ${unit}`])));
  return `<div class="chart" data-pts="${data}" data-w="${W}"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolución en ${unit}">${g}${area}<path d="${path}" fill="none" stroke="var(--acc)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>${dots}${lbl}</svg><div class="tip" hidden></div></div>`;
}
function weekSummary(d){
  const ws=addD(d,-d.getDay()); let e=[0,0],r=[0,0],m=0,ok=0,reps=0,km=0,av=0; const days=[];
  for(let i=0;i<7;i++){const x=addD(ws,i),k=key(x),l=L(k),t=tasksFor(x);
    if(t.includes("e")){e[1]++; if(l.e) e[0]++;} if(t.includes("r")){r[1]++; if(l.r){r[0]++; km+=runStats(runForD(x)).kmN;}}
    m+=(l.m||[]).filter(Boolean).length; const st=dayStatus(x); if(st==="done"||(st==="rest"&&x<=TODAY)) ok++; if(st!=="out"&&st!=="future") av++; days.push(st);
    Object.values(l.reps||{}).forEach(a=>a.forEach(v=>{if(v!=null) reps+=v;}));}
  return {e,r,m,ok,reps,km,days,ws,av:Math.max(1,av),any:e[0]+r[0]+m>0};
}
function viewProg(d){
  const w=weekOf(d), sm=weekSummary(d), adv=dietAdvice(), ms=measList(), T=S.tests;
  const mon=(()=>{const back=(TODAY.getDay()+6)%7;return key(addD(TODAY,-back));})();
  const cur=(S.meas||{})[mon]||{};
  const testRows=TESTS.map(([id,n,u,dir])=>{const a=(T.w1||{})[id], b=(T.w12||{})[id]; let diff="";
    if(a!=null&&b!=null){const dv=Math.round((b-a)*10)/10; const good=dv*dir>0; diff=`<span class="${dv===0?"":good?"pos":"neg"}">${dv>0?"+":""}${dec(dv)}</span>`;}
    return `<tr><td>${n} <span style="color:var(--muted);font-size:12px">${u}</span></td><td>${id==="k5"?"—":`<input inputmode="decimal" data-test="w1.${id}" value="${a!=null?dec(a):""}" aria-label="${n} semana 1">`}</td><td><input inputmode="decimal" data-test="w12.${id}" value="${b!=null?dec(b):""}" aria-label="${n} semana 12"></td><td>${diff}</td></tr>`;}).join("");
  return `<div class="hero"><span class="tag">Semana ${clampW(w)} · resumen</span><h2>Tu semana</h2>
    <div class="grid4">
      <div class="kpi"><span class="v">${sm.e[0]}<small>/${sm.e[1]}</small></span><span class="k">Entrenos</span><div class="bar"><i style="width:${sm.e[1]?sm.e[0]/sm.e[1]*100:0}%;background:var(--ej)"></i></div></div>
      <div class="kpi"><span class="v">${sm.r[0]}<small>/${sm.r[1]}</small></span><span class="k">Carreras · ${dec(sm.km.toFixed(1))} km</span><div class="bar"><i style="width:${sm.r[1]?sm.r[0]/sm.r[1]*100:0}%;background:var(--run)"></i></div></div>
      <div class="kpi"><span class="v">${sm.m}<small>/28</small></span><span class="k">Comidas</span><div class="bar"><i style="width:${sm.m/28*100}%;background:var(--food)"></i></div></div>
      <div class="kpi"><span class="v">${miles(sm.reps)}</span><span class="k">Repeticiones</span></div>
    </div>
    <div class="switch"><span><b>Semana de 4 días</b><br><span style="color:var(--muted);font-size:13px">Quita la sesión D del jueves y pasa su carrera al domingo.</span></span><button class="tg ${S.m4&&S.m4[w]?"on":""}" id="m4" role="switch" aria-checked="${!!(S.m4&&S.m4[w])}" aria-label="Semana de 4 días"></button></div>
    <div class="stats"><div class="stat"><div class="v">${streak()}</div><div class="k">Racha actual</div></div><div class="stat"><div class="v">${Math.max(S.best||0,streak())}</div><div class="k">Mejor racha</div></div><div class="stat"><div class="v">${sm.ok}/${sm.av}</div><div class="k">Días cumplidos</div></div></div>
    <button class="cta ghost" id="openRecap">Ver resumen de la semana</button>
  </div>
  <section><h3>Pesaje del lunes <small>en ayunas</small></h3><div class="card">
    <div class="form2"><div class="field"><label for="mDate">Fecha</label><input type="date" id="mDate" value="${mon}"></div><div></div>
    <div class="field"><label for="mKg">Peso (kg)</label><input id="mKg" inputmode="decimal" placeholder="73,0" value="${cur.kg!=null?dec(cur.kg):""}"></div>
    <div class="field"><label for="mCm">Cintura (cm)</label><input id="mCm" inputmode="decimal" placeholder="80,0" value="${cur.cm!=null?dec(cur.cm):""}"></div></div>
    <button class="cta" id="mSave">Guardar pesaje</button>
  </div></section>
  <section><h3>Ajuste de dieta <small>según tu tabla</small></h3>
    <div class="${adv.state==="adj"&&!adv.already?"banner":"banner g"}"><b>${adv.state==="wait"?"Aún sin datos suficientes":adv.state==="ok"?"Todo en orden":adv.already?"Ajuste ya aplicado":"Toca ajustar"}</b>${esc(adv.txt)}${adv.act?" "+esc(adv.act):""}
    ${adv.state==="adj"&&!adv.already?`<div class="row2" style="margin-top:10px"><button class="btn p" id="adjApply">Aplicar ajuste</button></div>`:""}</div>
    <div class="note" style="margin-top:8px">Objetivo actual: <b>${miles(kcalTarget())} kcal</b> y 140 g de proteína.${(S.adj||[]).length?` <button class="btn" id="adjUndo" style="padding:4px 10px;margin-left:6px">Deshacer último ajuste</button>`:""}</div>
  </section>
  <section><h3>Peso <small>kg</small></h3><div class="card">${chart(ms.filter(x=>x.kg!=null).map(x=>({d:x.d,v:x.kg})),"kg")}</div></section>
  <section><h3>Cintura <small>cm</small></h3><div class="card">${chart(ms.filter(x=>x.cm!=null).map(x=>({d:x.d,v:x.cm})),"cm")}</div></section>
  ${ms.length?`<section><h3>Historial</h3><div class="plain tscroll"><table class="mtable"><tr><th>Lunes</th><th>Peso</th><th>Cintura</th><th></th></tr>${[...ms].reverse().map(x=>`<tr><td>${fdate(x.d)}</td><td>${x.kg!=null?dec(x.kg):"–"}</td><td>${x.cm!=null?dec(x.cm):"–"}</td><td><button class="x" data-delm="${x.k}" aria-label="Borrar pesaje">×</button></td></tr>`).join("")}</table></div></section>`:""}
  <section><h3>Tests <small>semana 1 vs semana 12</small></h3><div class="plain tscroll"><table class="mtable"><tr><th>Test</th><th>Sem. 1</th><th>Sem. 12</th><th>Cambio</th></tr>${testRows}</table></div>
  <div class="note" style="margin-top:8px">Hazlos el mismo día y a la misma hora. El 5 km es el test del miércoles de la semana 12. Verde = mejora.</div></section>`;
}
function bindProg(){
  const w=weekOf(parse(ui.sel));
  $("#m4").onclick=()=>{hap(); S.m4=Object.assign({},S.m4); if(S.m4[w]) delete S.m4[w]; else S.m4[w]=true; save(); render(); toast(S.m4[w]?"Semana de 4 días activada":"Semana normal de 5 días");};
  $("#openRecap").onclick=()=>openRecap(addD(parse(ui.sel),-parse(ui.sel).getDay()));
  $("#mSave").onclick=()=>{const k=$("#mDate").value, kg=num($("#mKg").value), cm=num($("#mCm").value); if(!k||(kg==null&&cm==null)){toast("Escribe el peso o la cintura");return;}
    hap(); S.meas=Object.assign({},S.meas); S.meas[k]={kg,cm}; save(); render(); toast("Pesaje guardado");};
  $$("[data-delm]").forEach(b=>b.onclick=()=>{const k=b.dataset.delm, old=S.meas[k]; S.meas=Object.assign({},S.meas); delete S.meas[k]; save(); render(); toast("Pesaje borrado",{label:"Deshacer",fn:()=>{S.meas[k]=old;save();render();}});});
  const ap=$("#adjApply"); if(ap) ap.onclick=()=>{const a=dietAdvice(); S.adj=(S.adj||[]).concat([{kcal:a.kcal,txt:a.act,from:a.from}]); save(); render(); toast("Ajuste aplicado a tu dieta");};
  const un=$("#adjUndo"); if(un) un.onclick=()=>{S.adj=(S.adj||[]).slice(0,-1); save(); render();};
  $$("[data-test]").forEach(inp=>inp.onchange=()=>{const [wk,id]=inp.dataset.test.split("."); S.tests=JSON.parse(JSON.stringify(S.tests)); S.tests[wk]=S.tests[wk]||{}; const v=num(inp.value); if(v==null) delete S.tests[wk][id]; else S.tests[wk][id]=v; save(); render();});
  $$(".chart[data-pts]").forEach(c=>{const pts=JSON.parse(c.dataset.pts), svg=c.querySelector("svg"), tip=c.querySelector(".tip");
    const mv=ev=>{const r=svg.getBoundingClientRect(), sx=r.width/(+c.dataset.w), x=(ev.clientX-r.left)/sx; let best=pts[0]; pts.forEach(p=>{if(Math.abs(p[0]-x)<Math.abs(best[0]-x)) best=p;});
      tip.hidden=false; tip.textContent=best[2]; tip.style.left=best[0]*sx+"px"; tip.style.top=best[1]*sx+"px";};
    svg.addEventListener("pointermove",mv); svg.addEventListener("pointerdown",mv); svg.addEventListener("pointerleave",()=>tip.hidden=true);});
}

/* ---------- Resumen semanal ---------- */
function verdict(sm){
  const p=sm.ok/sm.av;
  if(p>=1) return "Semana perfecta. Así se construye el cambio.";
  if(p>=.85) return "Gran semana. Solo un detalle te separa de la perfecta.";
  if(p>=.6) return "Buena base. La próxima, a por un día más.";
  if(p>0) return "Semana irregular. Empieza la próxima con el primer entreno, aunque sea corto.";
  return sm.any?"Semana en marcha. Completa los días enteros para sumar racha.":"Semana sin registros. Mañana es el mejor día para volver.";
}
function openRecap(ws){
  const sm=weekSummary(ws), w=weekOf(ws);
  const best=[]; const seen=new Set();
  for(let i=0;i<7;i++){const k=key(addD(ws,i)), l=L(k); Object.entries(l.reps||{}).forEach(([id,v])=>{ if(seen.has(id)) return; const cur=v.filter(x=>x!=null); if(!cur.length) return; const prev=lastFor(id,key(ws)); if(prev){const a=Math.max(...prev.vals), b=Math.max(...cur); if(b>a){best.push(`${(EX[id]||{n:id}).n}: ${a} → ${b}`); seen.add(id);}}});}
  openSheet(`<div class="recap"><div><div class="eyebrow">Resumen · semana ${clampW(w)} · ${fdate(ws)} – ${fdate(addD(ws,6))}</div><h2>Tu semana</h2></div>
    <div class="score">${Math.round(sm.ok/sm.av*100)} %</div>
    <p style="margin:0;font-size:17px;font-weight:600">${verdict(sm)}</p>
    <div class="dayrow">${sm.days.map((s,i)=>`<div><i class="${s}">${s==="done"?CHECK:""}</i>${DL[i]}</div>`).join("")}</div>
    <div class="grid4"><div class="kpi"><span class="v">${sm.e[0]}<small>/${sm.e[1]}</small></span><span class="k">Entrenos</span></div><div class="kpi"><span class="v">${dec(sm.km.toFixed(1))}<small>km</small></span><span class="k">Corridos (aprox.)</span></div>
    <div class="kpi"><span class="v">${sm.m}<small>/28</small></span><span class="k">Comidas del plan</span></div><div class="kpi"><span class="v">${miles(sm.reps)}</span><span class="k">Repeticiones</span></div></div>
    ${best.length?`<div class="banner g"><b>Récords de la semana</b>${best.map(esc).join(" · ")}</div>`:""}
    <div class="note">Racha actual: <b>${streak()} días</b>. Mejor racha: <b>${Math.max(S.best||0,streak())} días</b>.</div>
    <button class="cta" id="closeS">Seguir</button></div>`);
  $("#closeS").onclick=closeSheet;
}
function maybeRecap(){
  if(!S.onboarded) return;
  const tw=weekOf(TODAY), pw=tw-1; if(pw<1||pw>12) return;
  S.recap=S.recap||{}; if(S.recap[pw]) return;
  S.recap[pw]=1; save();
  setTimeout(()=>openRecap(addD(startSun(),(pw-1)*7)),700);
}

/* =================== ADMINISTRACIÓN =================== */
function adminHead(title,back){return `<div class="sheethead">${back?`<button class="back" data-back="${back}" aria-label="Atrás">${BACK}</button>`:""}<h2>${esc(title)}</h2></div>`;}
function openAdmin(page){
  page=page||"home";
  let h="";
  if(page==="home"){
    const nLog=Object.values(S.log).filter(x=>x.e||x.r).length;
    h=`${adminHead("Administración")}
    <div class="card" style="flex-direction:row;align-items:center;gap:14px"><div style="width:56px;height:56px;border-radius:16px;overflow:hidden;flex:none">${LOGO}</div><div><div style="font-weight:700;font-size:17px">${esc(S.name||"Tu perfil")}</div><div class="sync">Inicio ${fdate(parse(S.start))} · ${nLog} días registrados</div></div></div>
    <div class="menu">
      <button data-go="profile"><span class="ic">👤</span><span><div class="t">Perfil</div><div class="d">Nombre y fecha de inicio</div></span>${CHEV}</button>
      <button data-go="plan"><span class="ic">🏋️</span><span><div class="t">Editar plan de entreno</div><div class="d">Ejercicios, series, repeticiones y descansos</div></span>${CHEV}</button>
      <button data-go="menu"><span class="ic">🍽️</span><span><div class="t">Editar menú semanal</div><div class="d">Qué comes cada día</div></span>${CHEV}</button>
      <button data-go="data"><span class="ic">💾</span><span><div class="t">Copia de seguridad</div><div class="d">Exportar, importar y borrar datos</div></span>${CHEV}</button>
      <button data-go="install"><span class="ic">📲</span><span><div class="t">Instalar en el iPhone</div><div class="d">${standalone()?"Ya está instalada":"Pantalla de inicio, sin barras"}</div></span>${CHEV}</button>
      <button data-go="about"><span class="ic">ℹ️</span><span><div class="t">Acerca de</div><div class="d">Versión ${VERSION}</div></span>${CHEV}</button>
    </div>
    <button class="btn" id="redoOb">Ver la bienvenida otra vez</button>`;
  }
  if(page==="profile"){
    h=`${adminHead("Perfil","home")}
    <div class="field"><label for="pName">Tu nombre</label><input id="pName" value="${esc(S.name||"")}" autocomplete="given-name" placeholder="Para saludarte"></div>
    <div class="field"><label for="pStart">Fecha de inicio del plan</label><input type="date" id="pStart" value="${S.start}"><span class="sync" style="display:block">La semana 1 es la semana (de domingo a sábado) de esta fecha. Los días anteriores no cuentan para la racha.</span></div>
    <button class="cta" id="pSave">Guardar</button>`;
  }
  if(page==="plan"){
    h=`${adminHead("Plan de entreno","home")}
    <p style="margin:0;color:var(--muted)">Toca una sesión para cambiar sus ejercicios. Los cambios se aplican a todas las semanas.</p>
    <div class="menu">${["C","A","B","D"].map(c=>`<button data-go="sess:${c}"><span class="ic" style="font-family:var(--display);font-weight:800;color:var(--ej)">${c}</span><span><div class="t">${esc(SESS[c].name)}</div><div class="d">${({C:"Domingo",A:"Lunes",B:"Martes",D:"Jueves"})[c]} · ${getSess(c).length} ejercicios${S.plan.sess[c]?" · editada":""}</div></span>${CHEV}</button>`).join("")}</div>`;
  }
  if(page.startsWith("sess:")){
    const c=page.slice(5), items=getSess(c);
    const opts=id=>Object.keys(EX).map(k=>`<option value="${k}" ${k===id?"selected":""}>${esc(EX[k].n)}</option>`).join("");
    const rests=[30,45,60,90,120,180];
    h=`${adminHead("Sesión "+c,"plan")}
    <div class="list">${items.map((it,i)=>`<div class="edrow"><select data-ed="${i}" data-f="0" aria-label="Ejercicio ${i+1}">${opts(it[0])}</select>
      <div class="r3"><input data-ed="${i}" data-f="1" type="number" min="1" max="8" inputmode="numeric" value="${it[1]}" aria-label="Series"><input data-ed="${i}" data-f="2" value="${esc(it[2])}" aria-label="Repeticiones"><select data-ed="${i}" data-f="3" aria-label="Descanso">${rests.map(r=>`<option value="${r}" ${r===it[3]?"selected":""}>${r>=120?r/60+" min":r+" s"}</option>`).join("")}</select></div>
      <div class="acts"><button data-mv="${i}:-1" aria-label="Subir">↑</button><button data-mv="${i}:1" aria-label="Bajar">↓</button><button data-del="${i}" aria-label="Quitar">✕</button></div></div>`).join("")}</div>
    <p class="sync" style="display:block">Series · repeticiones (texto libre, p. ej. «8-12» o «30 s») · descanso. En las semanas 1-4 y de descarga la app ajusta las series sola.</p>
    <div class="row2"><button class="btn p" id="edAdd">Añadir ejercicio</button>${S.plan.sess[c]?'<button class="btn danger" id="edReset">Restaurar original</button>':""}</div>`;
    ui.edCode=c;
  }
  if(page==="menu"){
    h=`${adminHead("Menú semanal","home")}
    <p style="margin:0;color:var(--muted)">Elige el plato de cada comida. Las recetas y las cantidades se ajustan solas.</p>
    ${[1,2,3,4,5,6,0].map(dw=>{const M=getMenu(dw); return `<div class="card" style="gap:8px"><b style="font-family:var(--display);font-size:18px;text-transform:uppercase">${DNAME[dw]}</b>${MEALS.map(([s,,lab])=>`<div class="field"><label>${lab}</label><select class="inp" data-mn="${dw}:${s}">${SLOT_OPTS[s].map(k=>`<option value="${k}" ${k===M[s]?"selected":""}>${esc(R[k].n)}</option>`).join("")}</select></div>`).join("")}</div>`;}).join("")}
    ${Object.keys(S.plan.menu||{}).length?'<button class="btn danger" id="mnReset">Restaurar menú original</button>':""}`;
  }
  if(page==="data"){
    h=`${adminHead("Copia de seguridad","home")}
    <div class="note">Tus datos se guardan en este dispositivo${dbRef?" y en tu cuenta de Claude":""}. Haz una copia de vez en cuando: si borras Safari o cambias de móvil, la necesitarás.</div>
    <div class="menu">
      <button id="exp"><span class="ic">⬆️</span><span><div class="t">Exportar copia</div><div class="d">Guárdala en Archivos o envíatela</div></span>${CHEV}</button>
      <button id="impBtn"><span class="ic">⬇️</span><span><div class="t">Importar copia</div><div class="d">Desde un archivo .json</div></span>${CHEV}</button>
    </div>
    <input type="file" id="impFile" accept="application/json,.json" hidden>
    <div id="expBox"></div>
    <button class="btn danger" id="wipe">Borrar todo el progreso</button>`;
  }
  if(page==="install"){
    h=`${adminHead("Instalar","home")}
    ${standalone()?`<div class="banner g"><b>Ya está instalada</b>La estás usando como app. Funciona sin conexión.</div>`:`
    <ol class="how" style="font-size:16px">
      <li>Abre esta página en <b>Safari</b>.</li>
      <li>Pulsa el botón <b>Compartir</b> (el cuadrado con la flecha hacia arriba).</li>
      <li>Elige <b>«Añadir a pantalla de inicio»</b> y pulsa <b>Añadir</b>.</li>
    </ol>
    <div class="note">Se abrirá a pantalla completa, con su icono y su pantalla de carga, y funcionará sin internet en el parque.</div>`}`;
  }
  if(page==="about"){
    h=`${adminHead("Acerca de","home")}
    <div style="width:84px;height:84px;border-radius:22px;overflow:hidden">${LOGO}</div>
    <div><div style="font-family:var(--display);font-size:28px;font-weight:800;text-transform:uppercase">Cambio Físico</div><div class="sync">Versión ${VERSION} · hecha a medida</div></div>
    <p style="margin:0;color:var(--muted)">Plan de 12 semanas: 5 entrenos, 4 carreras y 4 comidas al día. Los tres colores del logo son tus tres pilares: ejercicio, running y alimentación, subiendo.</p>
    <div class="note">Ilustraciones animadas propias. Fuentes Barlow Condensed e Inter (licencia libre). Sin anuncios, sin cuentas, sin rastreo. Coste: 0 €.</div>`;
  }
  openSheet(h);
  $$("[data-go]").forEach(b=>b.onclick=()=>{hap();openAdmin(b.dataset.go);});
  $$("[data-back]").forEach(b=>b.onclick=()=>openAdmin(b.dataset.back));
  bindAdmin(page);
}
function bindAdmin(page){
  const ro=$("#redoOb"); if(ro) ro.onclick=()=>{closeSheet(); showOnboarding(0);};
  if(page==="profile") $("#pSave").onclick=()=>{S.name=$("#pName").value.trim().slice(0,30); const v=$("#pStart").value; if(v){S.start=v; ui.sel=key(TODAY);} save(); toast("Perfil guardado"); openAdmin("home");};
  if(page.startsWith("sess:")){
    const c=ui.edCode, cur=()=>JSON.parse(JSON.stringify(getSess(c))), put=a=>{S.plan.sess=Object.assign({},S.plan.sess,{[c]:a}); save();};
    $$("[data-ed]").forEach(el=>el.onchange=()=>{const a=cur(), i=+el.dataset.ed, f=+el.dataset.f; let v=el.value;
      if(f===1) v=Math.max(1,Math.min(8,parseInt(v)||1)); if(f===3) v=+v; if(f===2) v=v.trim()||"10";
      a[i][f]=v; put(a); if(f===0) openAdmin(page);});
    $$("[data-mv]").forEach(b=>b.onclick=()=>{const [i,dl]=b.dataset.mv.split(":").map(Number), a=cur(), j=i+dl; if(j<0||j>=a.length) return; [a[i],a[j]]=[a[j],a[i]]; put(a); openAdmin(page);});
    $$("[data-del]").forEach(b=>b.onclick=()=>{const a=cur(); if(a.length<=1){toast("La sesión necesita al menos un ejercicio");return;} a.splice(+b.dataset.del,1); put(a); openAdmin(page);});
    $("#edAdd").onclick=()=>{const a=cur(); a.push(["plancha",3,"30 s",45]); put(a); openAdmin(page);};
    const rs=$("#edReset"); if(rs) rs.onclick=()=>{const o=Object.assign({},S.plan.sess); delete o[c]; S.plan.sess=o; save(); toast("Sesión restaurada"); openAdmin(page);};
  }
  if(page==="menu"){
    $$("[data-mn]").forEach(el=>el.onchange=()=>{const [dw,s]=el.dataset.mn.split(":"); const m=Object.assign({},S.plan.menu); m[dw]=Object.assign({},m[dw],{[s]:el.value}); S.plan.menu=m; save(); toast("Menú actualizado");});
    const rs=$("#mnReset"); if(rs) rs.onclick=()=>{S.plan.menu={}; save(); toast("Menú restaurado"); openAdmin("menu");};
  }
  if(page==="data"){
    $("#exp").onclick=exportData;
    $("#impBtn").onclick=()=>$("#impFile").click();
    $("#impFile").onchange=e=>{const f=e.target.files[0]; if(!f) return; const rd=new FileReader(); rd.onload=()=>importText(String(rd.result)); rd.readAsText(f);};
    $("#wipe").onclick=function(){ if(this.dataset.c){const st=S.start,nm=S.name;S=DEF();S.start=st;S.name=nm;S.onboarded=true;save();closeSheet();toast("Progreso borrado");} else {this.dataset.c=1;this.textContent="Pulsa otra vez para borrar todo";} };
  }
}
function exportData(){
  const json=JSON.stringify(S), name=`cambio-fisico-${key(TODAY)}.json`;
  const fallbackText=()=>{ $("#expBox").innerHTML=`<div class="field"><label for="expTxt">Copia este texto y guárdalo en Notas</label><textarea id="expTxt" readonly>${esc(json)}</textarea></div><div class="row2"><button class="btn p" id="cpy">Copiar</button></div><div class="field"><label for="impTxt">O pega aquí una copia para importarla</label><textarea id="impTxt"></textarea></div><button class="btn" id="impGo">Importar texto</button>`;
    $("#cpy").onclick=()=>{navigator.clipboard.writeText(json).then(()=>toast("Copiado")).catch(()=>{$("#expTxt").select();toast("Selecciona y copia el texto");});};
    $("#impGo").onclick=()=>importText($("#impTxt").value); };
  try{
    const file=new File([json],name,{type:"application/json"});
    if(navigator.canShare&&navigator.canShare({files:[file]})){ navigator.share({files:[file],title:"Copia de Cambio Físico"}).then(()=>toast("Copia exportada")).catch(e=>{ if(e&&e.name!=="AbortError") fallbackText(); }); return; }
  }catch(e){}
  if(!window.PWA && window.claude && claude.use){
    claude.use("downloads").then(dl=>{ if(!dl) return fallbackText(); dl.save({filename:name,data:json}).then(()=>toast("Copia guardada")).catch(e=>{ if(!e||e.code!=="dismissed"&&e.code!=="not_granted") fallbackText(); }); }).catch(fallbackText);
    return;
  }
  if(window.PWA){ const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([json],{type:"application/json"})); a.download=name; document.body.appendChild(a); a.click(); a.remove(); toast("Copia descargada"); return; }
  fallbackText();
}
function importText(txt){
  try{ const o=JSON.parse(txt); if(!o||typeof o!=="object"||!o.log) throw 0;
    const prev=JSON.stringify(S); S=migrate(o); S.onboarded=true; save(); closeSheet(); render();
    toast("Copia importada",{label:"Deshacer",fn:()=>{S=migrate(JSON.parse(prev));save();render();}});
  }catch(e){ toast("Ese archivo no es una copia válida"); }
}

/* =================== BIENVENIDA =================== */
let obStep=0, obData={};
function showOnboarding(step){
  obStep=step||0; obData={name:S.name||"",start:S.start,kg:"",cm:"",flex:"",dom:"",plank:""};
  const ob=$("#ob"); ob.hidden=false; drawOb();
}
function drawOb(){
  const ob=$("#ob"), N=5, dots=`<div class="dots">${Array.from({length:N},(_,i)=>`<i class="${i===obStep?"on":""}"></i>`).join("")}</div>`;
  let h="";
  if(obStep===0) h=`<div class="logo">${LOGO}</div><h1>Cambio<br>físico</h1><p>Tu plan de 12 semanas en el bolsillo. Cada día sabrás qué entrenar, cuánto correr y qué comer.</p>
    <div class="pillars"><div><i style="background:var(--ej)"></i><b>Ejercicio</b><span>5 sesiones, ilustradas</span></div><div><i style="background:var(--run)"></i><b>Running</b><span>Carreras guiadas por voz</span></div><div><i style="background:var(--food)"></i><b>Comida</b><span>Recetas al gramo</span></div></div>
    <button class="cta" id="obNext" style="--acc:var(--ej)">Empezar</button>`;
  if(obStep===1) h=`<h1>Hola</h1><p>Dos datos para personalizarla.</p>
    <div class="field"><label for="obName">¿Cómo te llamas?</label><input id="obName" value="${esc(obData.name)}" autocomplete="given-name" placeholder="Tu nombre"></div>
    <div class="field"><label for="obStart">¿Qué día empiezas el plan?</label><input type="date" id="obStart" value="${obData.start}"></div>
    <button class="cta" id="obNext">Continuar</button>`;
  if(obStep===2) h=`<h1>Punto de partida</h1><p>Mañana en ayunas es el mejor momento. Puedes dejarlo para luego.</p>
    <div class="form2"><div class="field"><label for="obKg">Peso (kg)</label><input id="obKg" inputmode="decimal" placeholder="73,0" value="${esc(obData.kg)}"></div><div class="field"><label for="obCm">Cintura (cm)</label><input id="obCm" inputmode="decimal" placeholder="80,0" value="${esc(obData.cm)}"></div></div>
    <button class="cta" id="obNext">Continuar</button><button class="btn" id="obSkip">Lo haré luego</button>`;
  if(obStep===3) h=`<h1>Tests de la semana 1</h1><p>Tu marca de hoy. En la semana 12 los repites y verás cuánto has mejorado.</p>
    <div class="field"><label for="obFlex">Flexiones máximas seguidas</label><input id="obFlex" inputmode="numeric" placeholder="12" value="${esc(obData.flex)}"></div>
    <div class="form2"><div class="field"><label for="obDom">Dominadas máximas</label><input id="obDom" inputmode="numeric" placeholder="2" value="${esc(obData.dom)}"></div><div class="field"><label for="obPlank">Plancha (segundos)</label><input id="obPlank" inputmode="numeric" placeholder="45" value="${esc(obData.plank)}"></div></div>
    <button class="cta" id="obNext">Continuar</button><button class="btn" id="obSkip">Lo haré luego</button>`;
  if(obStep===4) h=`<h1>Todo listo${obData.name?", "+esc(obData.name):""}</h1>
    ${standalone()?`<p>La app está instalada y funciona sin conexión.</p>`:`<p>Para tenerla como una app de verdad:</p><ol class="how" style="font-size:16px"><li>Abre esta página en <b>Safari</b>.</li><li>Pulsa <b>Compartir</b>.</li><li>Elige <b>«Añadir a pantalla de inicio»</b>.</li></ol>`}
    <div class="note"><b>Cómo funciona la racha:</b> un día cuenta si completas lo que toca (entreno y carrera). Viernes y sábado de descanso no la rompen.</div>
    <button class="cta" id="obNext">Ir a hoy</button>`;
  ob.innerHTML=`<div class="in">${dots}${h}${obStep>0&&obStep<4?'<button class="btn" id="obBack">Atrás</button>':""}</div>`;
  const keep=()=>{ const g=id=>{const e=$("#"+id); return e?e.value:null;};
    if(obStep===1){obData.name=g("obName")||""; obData.start=g("obStart")||obData.start;}
    if(obStep===2){obData.kg=g("obKg"); obData.cm=g("obCm");}
    if(obStep===3){obData.flex=g("obFlex"); obData.dom=g("obDom"); obData.plank=g("obPlank");} };
  $("#obNext").onclick=()=>{hap(); keep(); if(obStep<4){obStep++; drawOb(); ob.scrollTop=0;} else finishOb();};
  const sk=$("#obSkip"); if(sk) sk.onclick=()=>{ if(obStep===2){obData.kg="";obData.cm="";} else {obData.flex=obData.dom=obData.plank="";} obStep++; drawOb(); };
  const bk=$("#obBack"); if(bk) bk.onclick=()=>{keep(); obStep--; drawOb();};
}
function finishOb(){
  S.name=(obData.name||"").trim().slice(0,30);
  if(obData.start) S.start=obData.start;
  const kg=num(obData.kg), cm=num(obData.cm);
  if(kg!=null||cm!=null){ S.meas=Object.assign({},S.meas,{[S.start]:{kg,cm}}); S.tests.w1=Object.assign({},S.tests.w1); if(kg!=null) S.tests.w1.peso=kg; if(cm!=null) S.tests.w1.cint=cm; }
  [["flex","flex"],["dom","dom"],["plank","plank"]].forEach(([a,b])=>{const v=num(obData[a]); if(v!=null) S.tests.w1[b]=v;});
  S.onboarded=true; ui.sel=key(TODAY); save();
  const ob=$("#ob"); ob.style.transition="opacity .35s"; ob.style.opacity="0"; setTimeout(()=>{ob.hidden=true;ob.style.opacity="";},350);
  render(); setTimeout(()=>{confetti(); toast(S.name?`¡A por ello, ${S.name}!`:"¡A por ello!");},250);
}
function maybeOnboard(){ if(!S.onboarded && $("#ob").hidden) showOnboarding(0); }

/* =================== EVENTOS =================== */
function bindMain(){
  const ens=()=> (S.log[ui.sel]=S.log[ui.sel]||{});
  const de=$("#doneE"); if(de) de.onclick=()=>{hap(); mutate(()=>{const l=ens(); l.e=l.e?0:1;}); render();};
  const dr=$("#doneR"); if(dr) dr.onclick=()=>{hap(); mutate(()=>{const l=ens(); l.r=l.r?0:1;}); render();};
  const gr=$("#goRun"); if(gr) gr.onclick=()=>{hap(); unlockAudio(); openRun();};
  $$(".ex").forEach(b=>b.onclick=()=>{hap(); openEx(+b.dataset.i);});
  $$("[data-open]").forEach(b=>b.onclick=()=>{const i=b.dataset.open; ui.open[i]=!ui.open[i]; render();});
  $$("[data-two]").forEach(b=>b.onclick=()=>{ui.two=b.dataset.two==="1"; render();});
  $$("[data-meal]").forEach(b=>b.onclick=()=>{hap(); mutate(()=>{const l=ens(); l.m=(l.m||[0,0,0,0]).slice(); const i=+b.dataset.meal; l.m[i]=l.m[i]?0:1; if(l.m.every(Boolean)) setTimeout(()=>toast("4 de 4 comidas: día de dieta perfecto 🥗"),50);}); render();});
  const os=$("#openShop"); if(os) os.onclick=()=>{hap(); openShop();};
  if(ui.tab==="prog") bindProg();
}
$$("nav.tabs button").forEach(b=>b.onclick=()=>{if(ui.tab===b.dataset.t){window.scrollTo({top:0,behavior:"smooth"});return;} hap(); ui.tab=b.dataset.t; try{localStorage.setItem(LSK+"-tab",ui.tab);}catch(e){} render(); window.scrollTo(0,0);});
$("#prevW").onclick=()=>{hap(); ui.sel=key(addD(parse(ui.sel),-7));render();};
$("#nextW").onclick=()=>{hap(); ui.sel=key(addD(parse(ui.sel),7));render();};
$("#openAdmin").onclick=()=>{hap(); openAdmin("home");};
$("#streak").onclick=()=>{hap(); toast(`Racha: ${streak()} días · mejor: ${Math.max(S.best||0,streak())}`);};
// Al volver a la app otro día, refresca "hoy"
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible"){ const t=key(today()); if(t!==key(TODAY)){ if(ui.sel===key(TODAY)) ui.sel=t; render(); maybeRecap(); } } });

/* =================== PWA =================== */
if(window.PWA && "serviceWorker" in navigator && (location.protocol==="https:"||location.hostname==="localhost")){
  navigator.serviceWorker.register("sw.js").then(reg=>{
    reg.addEventListener("updatefound",()=>{const nw=reg.installing; nw&&nw.addEventListener("statechange",()=>{ if(nw.state==="installed"&&navigator.serviceWorker.controller) toast("Nueva versión disponible",{label:"Actualizar",fn:()=>nw.postMessage("skip")}); });});
  }).catch(()=>{});
  let reloaded=false; navigator.serviceWorker.addEventListener("controllerchange",()=>{ if(!reloaded){reloaded=true; location.reload();} });
}

render();
maybeOnboard();
maybeRecap();
