let map = null;
let canvas, ctx;

Array.prototype.random = function () {
	return this[Math.floor((Math.random()*this.length))];
}

function Mapa(tamPixel, cPxAncho, cPxAlto) {
	this.tamPixel = tamPixel;
	this.cPxAncho = cPxAncho;
	this.cPxAlto = cPxAlto;
	this.suelos = [];
	this.suelosNext = [];
	this.mosquitos = [];
	this.mosquitosNext = [];
	this.limiteMosquito = 40;
	this.generacion = 0;
	this.chancepais = 30;
	this.chanceAgua = 18;
	this.cantidadDePaises = 180;
	
	this.removerMosquitos = function() {
		this.mosquitos = [];
		this.mosquitosNext = [];
	}
	
	this.listarMosquitos = function() {
		for (var i = 0; i < this.mosquitos.length; i++) {
			console.log(this.mosquitos[i].x + " " + this.mosquitos[i].y);
		}
	}
	
	
	this.infectarPais = function () {
		$("#automaticoStatus").val("Modo Automatico: OFF");
		
		// Contar el número de paiss en el mapa y eliminar cualquier infección. 
		var alto = mapa.cPxAlto;
		var ancho = mapa.cPxAncho;
		var cpaiss = 0;
		
		for (y = 0; y <= alto-1; y++) {
			for (x = 0; x <= ancho-1; x++) {				
				var posicionsuelo = (y * this.cPxAncho) + x;
				if (this.suelos[posicionsuelo].nombre === "pais") {
					cpaiss++;
					this.suelos[posicionsuelo].sueloInfectado = false;
				}
					
			}
		}
		mapa.cantidadDePaises = cpaiss;		
		if (cpaiss <= 0)
			return;
		
		// Elegir al azar la primera pais para infectar 
		var paisInfectadoInicial = 0;
		if (cpaiss > 0)
			paisInfectadoInicial = randomIntFromInterval(1, cpaiss);
		
		// Buscando la pais elegida y configurándola como infectado 
		var paisactual = 0;		
		for (y = 0; y <= alto-1; y++) {
			for (x = 0; x <= ancho-1; x++) {				
				var posicionsuelo = (y * this.cPxAncho) + x;
				if (this.suelos[posicionsuelo].nombre === "pais")
					paisactual++;
				
				if (this.suelos[posicionsuelo].nombre === "pais" && paisactual == paisInfectadoInicial) {
					this.suelos[posicionsuelo].sueloInfectado = true;					
					break;
				}
				
			}
			if (paisactual >= paisInfectadoInicial)
				break;
		}
		// var cPaisesInfectados = 0;
		// for (y = 0; y <= alto-1; y++) {
		// 	for (x = 0; x <= ancho-1; x++) {				
		// 		var posicionsuelo = (y * this.cPxAncho) + x;
		// 		if (this.suelos[posicionsuelo].sueloInfectado == true) {
		// 			cPaisesInfectados++;
		// 		}
		// 	}		
		// }
		// console.log("c paises infectados: " + cPaisesInfectados);

		$("#cinfectadosglobal").val(mapa.suelos.filter((item) => item.nombre == "pais" && item.sueloInfectado).length);
		$("#cinfectadosanorte").val(mapa.suelos.filter((item) => item.nombre == "pais" && item.continente == "NorteAmerica" && item.sueloInfectado).length);
		$("#cinfectadosasur").val(mapa.suelos.filter((item) => item.nombre == "pais" && item.continente == "SurAmerica" && item.sueloInfectado).length);
		$("#cinfectadoseuropa").val(mapa.suelos.filter((item) => item.nombre == "pais" && item.continente == "Europa" && item.sueloInfectado).length);
		$("#cinfectadosasia").val(mapa.suelos.filter((item) => item.nombre == "pais" && item.continente == "Asia" && item.sueloInfectado).length);
		$("#cinfectadosafrica").val(mapa.suelos.filter((item) => item.nombre == "pais" && item.continente == "Africa" && item.sueloInfectado).length);
		$("#cinfectadosoceania").val(mapa.suelos.filter((item) => item.nombre == "pais" && item.continente == "Oceania" && item.sueloInfectado).length);	
	}
	
	this.propagarVirus = function() {
		$("#automaticoStatus").val("Modo Automatico: ON");
		mosquitosNext = [];
		// Pasando a la siguiente matriz solo mosquitos válidos 
		this.mosquitos.forEach(function(item) {
			if (item.x != null && item.y != null)
				mosquitosNext.push(item);
		});
		
		// Inserta un nuevo mosquito en el mapa al azar si la cantidad de mosquitos existentes es 
		// inferior al limite de mosquitos
		if (this.cMosquitos() < this.limiteMosquito) {
			var sueloAleatorio = this.sueloAguaAleatorio();			
			var x = this.suelos[sueloAleatorio].dx;
			var y = this.suelos[sueloAleatorio].dy;
			
			this.mosquitosNext.push(crearMosquito(x, y, false))
		}
		
		// Movimiento de los mosquitos por el mapa
		this.mosquitosNext.forEach(function(item) {
			if (item.x != null && item.y != null) {				
				var direccion = randomIntFromInterval(1,4);

				if (item.dy < item.y)
					direccion = 1;
				else if (item.dy > item.y)
					direccion = 2;
				else if (item.dx < item.x)
					direccion = 3;
				else if (item.dx > item.x)
					direccion = 4;

				if (item.dy == item.y && item.dx == item.x)
					reasignarMosquito(item);

				if (direccion == 1 && mapa.sueloNorteExiste(item.x, item.y) == true) {
					item.y -= 1;
					if (item.infectado == true && mapa.suelos[(mapa.cPxAncho * item.y) + item.x].nombre === "pais")
						mapa.suelos[(mapa.cPxAncho * item.y) + item.x].sueloInfectado = true;
					if (mapa.suelos[(mapa.cPxAncho * item.y) + item.x].sueloInfectado == true)
						item.infectado = true;

				} else if (direccion == 2 && mapa.suelosurExiste(item.x, item.y) == true) {
					item.y += 1;
					if (item.infectado == true && mapa.suelos[(mapa.cPxAncho * item.y) + item.x].nombre === "pais")
						mapa.suelos[(mapa.cPxAncho * item.y) + item.x].sueloInfectado = true;
					if (mapa.suelos[(mapa.cPxAncho * item.y) + item.x].sueloInfectado == true)
						item.infectado = true;

				} else if (direccion == 3 && mapa.sueloOesteExiste(item.x, item.y) == true) {
					item.x -= 1;
					if (item.infectado == true && mapa.suelos[(mapa.cPxAncho * item.y) + item.x].nombre === "pais")
						mapa.suelos[(mapa.cPxAncho * item.y) + item.x].sueloInfectado = true;
					if (mapa.suelos[(mapa.cPxAncho * item.y) + item.x].sueloInfectado == true)
						item.infectado = true;

				} else if (direccion == 4 && mapa.sueloLesteExiste(item.x, item.y) == true) {
					item.x += 1;
					if (item.infectado == true && mapa.suelos[(mapa.cPxAncho * item.y) + item.x].nombre === "pais")
						mapa.suelos[(mapa.cPxAncho * item.y) + item.x].sueloInfectado = true;
					if (mapa.suelos[(mapa.cPxAncho * item.y) + item.x].sueloInfectado == true)
						item.infectado = true;
				}
			}	
		});
		this.mosquitos = this.mosquitosNext;
		this.generacion++;
		$("#generacion").val(this.generacion);
		$("#cinfectadosglobal").val(mapa.suelos.filter((item) => item.nombre == "pais" && item.sueloInfectado).length);
		$("#cinfectadosanorte").val(mapa.suelos.filter((item) => item.nombre == "pais" && item.continente == "NorteAmerica" && item.sueloInfectado).length);
		$("#cinfectadosasur").val(mapa.suelos.filter((item) => item.nombre == "pais" && item.continente == "SurAmerica" && item.sueloInfectado).length);
		$("#cinfectadoseuropa").val(mapa.suelos.filter((item) => item.nombre == "pais" && item.continente == "Europa" && item.sueloInfectado).length);
		$("#cinfectadosasia").val(mapa.suelos.filter((item) => item.nombre == "pais" && item.continente == "Asia" && item.sueloInfectado).length);
		$("#cinfectadosafrica").val(mapa.suelos.filter((item) => item.nombre == "pais" && item.continente == "Africa" && item.sueloInfectado).length);
		$("#cinfectadosoceania").val(mapa.suelos.filter((item) => item.nombre == "pais" && item.continente == "Oceania" && item.sueloInfectado).length);
		$("#cmosquitos").val(this.mosquitos.length);
	}
	
	this.cMosquitos = function() {
		var c = 0;
		this.mosquitosNext.forEach(function(item) {
			if (item.x != null && item.y != null) {
				c++;
			}
		});
		return c;
	}	
	this.sueloAguaAleatorio = function() {
		var alto = mapa.cPxAlto;
		var ancho = mapa.cPxAncho;
		var cAgua = 0;
		
		for (y = 0; y <= alto-1; y++) {
			for (x = 0; x <= ancho-1; x++) {				
				var posicionsuelo = (y * this.cPxAncho) + x;
				if (this.suelos[posicionsuelo].nombre === "agua")
					cAgua++;
			}
		}
		
		var aguaactual = 0;
		var sueloAguaAleatorio = randomIntFromInterval(1, cAgua);
		
		for (y = 0; y <= alto-1; y++) {
			for (x = 0; x <= ancho-1; x++) {
				var posicionsuelo = (y * this.cPxAncho) + x;	
				
				if (this.suelos[posicionsuelo].nombre === "agua")
					aguaactual++;
				if (aguaactual === sueloAguaAleatorio)
					return posicionsuelo;	
			}
		}
	}

	this.vecinossuelo = function(nombresuelo, x, y) {
		var n = this.sueloNorteExiste(x, y);
		var s = this.suelosurExiste(x, y);
		var l = this.sueloLesteExiste(x, y);
		var o = this.sueloOesteExiste(x, y);		
		var ne = this.sueloNordesteExiste(x, y);
		var se = this.suelosudesteExiste(x, y);
		var so = this.suelosudoesteExiste(x, y);
		var no = this.sueloNoroesteExiste(x, y);		
		var posicionsuelo = (y * this.cPxAncho) + x;
		var numvecinos = 0;		
		if (n && this.suelos[posicionsuelo - this.cPxAncho].nombre === nombresuelo)
			numvecinos++;
		if (s && this.suelos[posicionsuelo + this.cPxAncho].nombre === nombresuelo)
			numvecinos++;
		if (l && this.suelos[posicionsuelo + 1].nombre === nombresuelo)
			numvecinos++;
		if (o && this.suelos[posicionsuelo - 1].nombre == nombresuelo)
			numvecinos++;
		if (ne && this.suelos[posicionsuelo - (this.cPxAncho - 1)].nombre == nombresuelo)
			numvecinos++;
		if (se && this.suelos[posicionsuelo + (this.cPxAncho + 1)].nombre == nombresuelo)
			numvecinos++;
		if (so && this.suelos[posicionsuelo + (this.cPxAncho - 1)].nombre == nombresuelo)
			numvecinos++;
		if (no && this.suelos[posicionsuelo - (this.cPxAncho + 1)].nombre == nombresuelo)
			numvecinos++;		
		return numvecinos;
	}	
	this.suelo2Norte = function(nombresuelo, x, y) {
		var posicionsuelo = (y * this.cPxAncho) + x;
		if (y <= 1)
			return false;
		else{
			if (this.suelos[posicionsuelo - this.cPxAncho].nombre === nombresuelo &&
			this.suelos[posicionsuelo - (this.cPxAncho * 2)].nombre === nombresuelo)
				return true;
			else
				return false;
		}
	}	
	this.suelo1Norte = function(nombresuelo, x, y) {
		var posicionsuelo = (y * this.cPxAncho) + x;
		if (y <= 0)
			return false;
		else{
			if (this.suelos[posicionsuelo - this.cPxAncho].nombre === nombresuelo)
				return true;
			else
				return false;
		}
	}	
	this.suelo2Sur = function(nombresuelo, x, y) {
		var posicionsuelo = (y * this.cPxAncho) + x;
		if (y >= this.cPxAlto - 2)
			return false;
		else{
			if (this.suelos[posicionsuelo + this.cPxAncho].nombre === nombresuelo &&
			this.suelos[posicionsuelo + (this.cPxAncho * 2)].nombre === nombresuelo)
				return true;
			else
				return false;
		}
	}	
	this.suelo1Sur = function(nombresuelo, x, y) {
		var posicionsuelo = (y * this.cPxAncho) + x;
		if (y >= this.cPxAlto - 1)
			return false;
		else{
			if (this.suelos[posicionsuelo + this.cPxAncho].nombre === nombresuelo)
				return true;
			else
				return false;
		}
	}	
	this.suelo2Leste = function(nombresuelo, x, y) {
		var posicionsuelo = (y * this.cPxAncho) + x;
		if (x >= this.cPxAncho - 2)
			return false;
		else{
			if (this.suelos[posicionsuelo + 1].nombre === nombresuelo &&
			this.suelos[posicionsuelo + 2].nombre === nombresuelo)
				return true;
			else
				return false;
		}
	}
	this.suelo1Leste = function(nombresuelo, x, y) {
		var posicionsuelo = (y * this.cPxAncho) + x;
		if (x >= this.cPxAncho - 1)
			return false;
		else{
			if (this.suelos[posicionsuelo + 1].nombre === nombresuelo)
				return true;
			else
				return false;
		}
	}	
	this.suelo2Oeste = function(nombresuelo, x, y) {
		var posicionsuelo = (y * this.cPxAncho) + x;
		if (x <= 1)
			return false;
		else{
			if (this.suelos[posicionsuelo - 1].nombre === nombresuelo &&
			this.suelos[posicionsuelo - 2].nombre === nombresuelo)
				return true;
			else
				return false;
		}
	}	
	this.suelo1Oeste = function(nombresuelo, x, y) {
		var posicionsuelo = (y * this.cPxAncho) + x;
		if (x <= 0)
			return false;
		else{
			if (this.suelos[posicionsuelo - 1].nombre === nombresuelo)
				return true;
			else
				return false;
		}
	}	
	this.suelo1Nordeste = function(nombresuelo, x, y) {
		var posicionsuelo = (y * this.cPxAncho) + x;
		if (y <= 0 || x >= this.cPxAncho - 1)
			return false;
		else{
			if (this.suelos[(posicionsuelo - this.cPxAncho) + 1].nombre === nombresuelo)
				return true;
			else
				return false;
		}
	}	
	this.suelo1Sudeste = function(nombresuelo, x, y) {
		var posicionsuelo = (y * this.cPxAncho) + x;
		if (x >= this.cPxAncho - 1 || y >= this.cPxAlto - 1)
			return false;
		else{
			if (this.suelos[(posicionsuelo + this.cPxAncho) + 1].nombre === nombresuelo)
				return true;
			else
				return false;
		}
	}	
	this.suelo1Sudoeste = function(nombresuelo, x, y) {
		var posicionsuelo = (y * this.cPxAncho) + x;
		if (x <= 0 || y >= this.cPxAlto - 1)
			return false;
		else{
			if (this.suelos[(posicionsuelo + this.cPxAncho) - 1].nombre === nombresuelo)
				return true;
			else
				return false;
		}
	}	
	this.suelo1Noroeste = function(nombresuelo, x, y) {
		var posicionsuelo = (y * this.cPxAncho) + x;
		if (y <= 0 || x <= 0)
			return false;
		else{
			if (this.suelos[(posicionsuelo - this.cPxAncho) - 1].nombre === nombresuelo)
				return true;
			else
				return false;
		}
	}	
	this.sueloNorteExiste = function(x, y) {
		if (y <= 0 || x < 0 || x > this.cPxAncho - 1)
			return false;
		else
			return true;
	}	
	this.suelosurExiste = function(x, y) {
		if (y >= this.cPxAlto - 1 || x < 0 || x > this.cPxAncho - 1)
			return false;
		else
			return true;
	}
	this.sueloLesteExiste = function(x, y) {
		if (x >= this.cPxAncho - 1 || y < 0 || y > this.cPxAlto - 1)
			return false;
		else
			return true;
	}
	this.sueloOesteExiste = function(x, y) {
		if (x <= 0 || y < 0 || y > this.cPxAlto - 1)
			return false;
		else
			return true;
	}
	this.sueloNordesteExiste = function(x, y) {
		if (x >= this.cPxAncho - 1 || y <= 0)
			return false;
		else
			return true;
	}
	this.suelosudesteExiste = function(x, y) {
		if (x >= this.cPxAncho - 1 || y >= this.cPxAlto - 1)
			return false;
		else
			return true;
	}
	this.suelosudoesteExiste = function(x, y) {
		if (x <= 0 || y >= this.cPxAlto - 1)
			return false;
		else
			return true;
	}
	this.sueloNoroesteExiste = function(x, y) {
		if (x <= 0 || y <= 0)
			return false;
		else
			return true;
	}
}

var mapa = new Mapa(8, 200, 110);

var suelosprite = new Image();
suelosprite.src = "piso_pixel.png";
var sueloMosquito = new Image();
sueloMosquito.src = "mosquito.png"

function Suelo(nombre, sx, sy, dx, dy, dWidth, dHeight, continente = null) {
	this.sueloInfectado = false;
    this.nombre = nombre;	
	this.sWidth = 8;
	this.sHeight = 8;

	this.continente = continente;

	this.sx = sx;
	this.sy = sy;
	this.dx = dx;
	this.dy = dy;
	this.dWidth = dWidth;
	this.dHeight = dHeight;	
}


function crearAgua(x, y) {
	return new Suelo("agua", 48, 0, x, y, mapa.tamPixel, mapa.tamPixel);
}
function crearPais(x, y, continente) {
	return new Suelo("pais", 56, 0, x, y, mapa.tamPixel, mapa.tamPixel, continente);
}
function crearNorteAmerica(x, y) {
	return new Suelo("norteamerica", 0, 0, x, y, mapa.tamPixel, mapa.tamPixel);
}
function crearSurAmerica(x, y) {
	return new Suelo("suramerica", 8, 0, x, y, mapa.tamPixel, mapa.tamPixel);
}
function crearEuropa(x, y) {
	return new Suelo("europa", 16, 0, x, y, mapa.tamPixel, mapa.tamPixel);
}
function crearAsia(x, y) {
	return new Suelo("asia", 24, 0, x, y, mapa.tamPixel, mapa.tamPixel);
}
function crearAfrica(x, y) {
	return new Suelo("africa", 32, 0, x, y, mapa.tamPixel, mapa.tamPixel);
}
function crearOceania(x, y) {
	return new Suelo("oceania", 40, 0, x, y, mapa.tamPixel, mapa.tamPixel);
}

function Mosquito(x, y, dx, dy, infectado = false) {
	this.x = x;
	this.y = y;
	this.infectado = infectado;

	this.dx = dx;
	this.dy = dy;
}

function crearMosquito(x, y, infectado) {
	let pais = obtenerPaisAleatorio();
	return new Mosquito(x, y, pais.dx, pais.dy, infectado);
}

function obtenerPaisAleatorio() {
	let paises = mapa.suelos.filter((item) => item.nombre == "pais");
	return paises.random();
}

function reasignarMosquito(mosquito) {
	let pais = obtenerPaisAleatorio();
	mosquito.dx = pais.dx;
	mosquito.dy = pais.dy;
}

function iniciar() {
	canvas = document.getElementById("mycanvas");	
	canvas.width =  mapa.cPxAncho * mapa.tamPixel;
	canvas.height = mapa.cPxAlto * mapa.tamPixel;	
	ctx = canvas.getContext("2d");
	ctx.fillStyle = "black";
	ctx.imageSmoothingEnabled = false;

	$.getJSON("map.json", function(json) {
		map = json;
		generarMapa();
		mapa.suelos.forEach(dibujarsuelos);
	});
}


function generarMapa() {
	var alto = mapa.cPxAlto;
	var ancho = mapa.cPxAncho;
	
	mapa.generacion = 0;
	$("#generacion").val(mapa.generacion);
	mapa.suelos = [];
	mapa.mosquitos = [];
	mapa.mosquitosNext = [];
	
	for (y = 0; y <= alto-1; y++) {
		for (x = 0; x <= ancho-1; x++) {
			if (map[y][x] == " ") {
				mapa.suelos.push(crearAgua(x, y));
			}
			if (map[y][x] == "n") {
				mapa.suelos.push(crearNorteAmerica(x, y));
			}
			if (map[y][x] == "s") {
				mapa.suelos.push(crearSurAmerica(x, y));
			}
			if (map[y][x] == "e") {
				mapa.suelos.push(crearEuropa(x, y));
			}
			if (map[y][x] == "a") {
				mapa.suelos.push(crearAsia(x, y));
			}
			if (map[y][x] == "f") {
				mapa.suelos.push(crearAfrica(x, y));
			}
			if (map[y][x] == "o") {
				mapa.suelos.push(crearOceania(x, y));
			}
			if (map[y][x] == "c") {
				if (map[y-1][x] == "n" || map[y][x-1] == "n" || map[y+1][x] == "n" || map[y][x+1] == "n")
					mapa.suelos.push(crearPais(x, y, "NorteAmerica"));
				if (map[y-1][x] == "s" || map[y][x-1] == "s" || map[y+1][x] == "s" || map[y][x+1] == "s")
					mapa.suelos.push(crearPais(x, y, "SurAmerica"));
				if (map[y-1][x] == "e" || map[y][x-1] == "e" || map[y+1][x] == "e" || map[y][x+1] == "e")
					mapa.suelos.push(crearPais(x, y, "Europa"));
				if (map[y-1][x] == "a" || map[y][x-1] == "a" || map[y+1][x] == "a" || map[y][x+1] == "a")
					mapa.suelos.push(crearPais(x, y, "Asia"));
				if (map[y-1][x] == "f" || map[y][x-1] == "f" || map[y+1][x] == "f" || map[y][x+1] == "f")
					mapa.suelos.push(crearPais(x, y, "Africa"));
				if (map[y-1][x] == "o" || map[y][x-1] == "o" || map[y+1][x] == "o" || map[y][x+1] == "o")
					mapa.suelos.push(crearPais(x, y, "Oceania"));
			} 
		}
	}
}

function dibujarsuelos(item) {
	var tamPixel = mapa.tamPixel;	
	ctx.drawImage(
		suelosprite,
		item.sx,
		item.sy,
		item.sWidth,
		item.sHeight,
		item.dx * tamPixel,
		item.dy * tamPixel,
		item.dWidth,
		item.dHeight
	);
	
	if (item.sueloInfectado == true) {
		ctx.drawImage(
			sueloMosquito,
			0,
			0,
			item.sWidth,
			item.sHeight,
			item.dx * tamPixel,
			item.dy * tamPixel,
			item.dWidth,
			item.dHeight
		);
	}
	
	for (var i = 0; i < mapa.mosquitos.length; i++) {
		if (mapa.mosquitos[i].x == item.dx && mapa.mosquitos[i].y == item.dy && mapa.mosquitos[i].infectado == false) {
			ctx.drawImage(
				sueloMosquito,
				8,
				0,
				item.sWidth,
				item.sHeight,
				item.dx * tamPixel,
				item.dy * tamPixel,
				item.dWidth,
				item.dHeight
			);
		}
		
		if (mapa.mosquitos[i].x == item.dx && mapa.mosquitos[i].y == item.dy && mapa.mosquitos[i].infectado == true) {
			ctx.drawImage(
				sueloMosquito,
				16,
				0,
				item.sWidth,
				item.sHeight,
				item.dx * tamPixel,
				item.dy * tamPixel,
				item.dWidth,
				item.dHeight
			);
		}
		
	}
}

function propagacionAutomatica() {
	if (mapa.suelos.filter((item) => item.nombre == "pais" && item.sueloInfectado).length == mapa.cantidadDePaises) {
		pararpropagacionAutomatica()
		alert("Todo el planeta ha sido contaminado :(");
	}
	mapa.propagarVirus();
	mapa.suelos.forEach(dibujarsuelos);
}

var refreshIntervalIdpropagacion;

function iniciarPropagacionAutomatica() {
	pararpropagacionAutomatica();
	refreshIntervalIdpropagacion = setInterval(function() { propagacionAutomatica(); }, 65);
}

function pararpropagacionAutomatica() {
	clearInterval(refreshIntervalIdpropagacion);
}

function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

// JQUERY
$(document).ready(function() {
	iniciar();
	$("#automaticoStatus").val("Modo Automatico: OFF");
	
	// infectar un pais aleatorio
	$("#btnInfectarPais").click(function() {
		pararpropagacionAutomatica();
		mapa.infectarPais();
		mapa.suelos.forEach(dibujarsuelos);
    });
	
	// iniciar propagacion automatica del virus
	$("#btnSimularPropagacion").click(function() {
		pararpropagacionAutomatica();
		iniciarPropagacionAutomatica();		
    });
	
	// parar propagacion automatica del virus
	$("#btnPararPropagacion").click(function() {
		pararpropagacionAutomatica();
		$("#automaticoStatus").val("Modo Automatico: OFF");
    });
	
	// remover mosquitos
	$("#btnRemoverMosquitos").click(function() {
		mapa.removerMosquitos();
		mapa.suelos.forEach(dibujarsuelos);
    });

});