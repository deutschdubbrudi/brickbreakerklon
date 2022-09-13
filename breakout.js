/*var c = document.getElementById("Leinwand");
var ctx = c.getContext("2d");
ctx.width = "450px";
ctx.heigth = "800px";
*/
let gamecontainer = 
	{
		Element: document.getElementById("gamecontainer"),
		width: 450,
		height: 800,
		fieldheight: 700,
		demoplay: true,
	};

let game = 
	{	
		scale: window.innerHeight / gamecontainer.height,
		logicCalcsPerSecond: 200,
		currentlvl: 0,
		pausiert: false,
		pausieren()
		{
			game.pausiert = true
			music.Element.volume = 0.005
			music.Element.loop = false			

		},
		entpausieren()
		{	
			if (game.inMenue == false)
			{
				game.pausiert = false
				music.Element.volume = 1			
				music.Element.loop = true
				music.Element.play()			
			}
		},
		brokenbricks: 0,
		gewonnen: false,
		inMenue: true,
		SpielGeschwindigkeitsFaktorBerechnen()
		{
			//~ if (timer.verbleibendeZeitAnteil <)
			//~ {
				//~ return 1.5
			//~ }
			//~ else if (this.brokenbricks >= 12)
			//~ {
				//~ return 2
			//~ }
			//~ else if (this.brokenbricks >= 18)
			//~ {
				//~ return 3
			//~ }
			//~ else if (this.brokenbricks >= 32)
			//~ {
				//~ return 4
			//~ }
			//~ else if (this.brokenbricks >= 40)
			//~ {
				//~ return 5
			//~ }
			//~ else
			//~ {
				//~ return 1
			//~ }
			if(game.currentlvl == 5 && (level[5].timer - timer.momentaneZeit) / game.logicCalcsPerSecond > 15)
			{
				return (1 - timer.verbleibendeZeitAnteil) * 2 + 1.75
			}
			return (1 - timer.verbleibendeZeitAnteil) * 2 + 1
		},
		Siegpruefung()
		{
			
			if (this.gewonnen == false)
			{
				this.gewonnen = true
				for (let i = 0; i < BrickArray.length; i++)
				{
					for (let j = 0; j < BrickArray[i].length; j++)
					{
						if (BrickArray[i][j].Trefferpunkte > 0)
						{
							this.gewonnen = false
						}
					}
				}
			}
			if (this.gewonnen == true)
			{
				LevelGewonnen()
			}		
		},
		
	}
	

gamecontainer.Element.style.transform = "scale("  + game.scale + ")"


let maus = 
	{
		wurdeBewegt: false,
		x: 0,
		y: 0,
		istTouch: false,
	};

let music =
	{
		Element: new Audio(),
		changeBGM(trackID)
		{
			//~ this.Element.stop()
			this.Element.src = "bgm"+ trackID +".opus"
			this.Element.load()
			this.Element.loop = true
			//~ this.Element.play()
		},
		playSFX(sfxID)
		{
			let sfxElement = new Audio("sfx" + sfxID + ".ogg")
			sfxElement.play()
		},		
	}

let punkte =
	{
		momentanePunktzahl: 1000000,
		highscore: 0,
		Element: document.getElementById("scoreboard"),
		ElementMomentanePunktzahl: document.getElementById("momentanepunkte"),
		ElementHighScore: document.getElementById("highscore"),
		SollZeichnen: true,
		 
		Zeichnen()
		{
			if (this.SollZeichnen == true)
			{
				this.ElementMomentanePunktzahl.textContent = addLeadingNumberZeros(this.momentanePunktzahl, 9)
				this.ElementHighScore.textContent = addLeadingNumberZeros(this.highscore, 9)
				this.SollZeichnen = false
			}
		},
		highscorePruefung()
		{
			if(this.highscore < this.momentanePunktzahl && gamecontainer.demoplay == false)
			{
				this.highscore = this.momentanePunktzahl
			}
		},

	}
	
let timer =
	{
		momentaneZeit: 0,
		verbleibendeZeitAnteil: 1,
		Element: document.getElementById("timerremaining"),
		Zeichnen()
		{
			//~ this.Element.style.width = (450 - 450 * (1 - this.momentaneZeit / level[game.currentlvl].timer)) + "px"
			//~ this.Element.style.width = (gamecontainer.width * this.verbleibendeZeitAnteil) + "px"
			this.Element.style.transform = "scaleX(" +  this.verbleibendeZeitAnteil + ")"
		},
		Pruefen()
		{
			this.momentaneZeit--
			this.verbleibendeZeitAnteil = this.momentaneZeit / level[game.currentlvl].timer
			if (this.momentaneZeit <= 0)
			{
				LevelVerloren()
			}
		}
		
	}

let leben =
	{
		maximaleLeben: 3,
		momentaneLeben: 3,
		Element: document.getElementById("heartcontainer"),
		HerzElementArray: [],
		SollZeichnen: true,
		HerzElementArrayFuellen()
		{
			for (let i = 0; i < this.maximaleLeben; i++)
			{
				this.HerzElementArray[i] = document.createElement("div")
				this.HerzElementArray[i].className = "herz"
		        this.Element.appendChild(this.HerzElementArray[i]);
		        this.SollZeichnen = true
			}
		},
		
		LebenVerlieren()
		{
			this.momentaneLeben--
			this.SollZeichnen = true
			if (this.momentaneLeben <= 0)
			{
				LevelVerloren()
			}
		},
		
		Zeichnen()
		{
			if (this.SollZeichnen == true)
			{
				for (let i = 0; i < this.maximaleLeben; i++)
				{
					if (i < this.momentaneLeben)
					{
						this.HerzElementArray[i].style.backgroundImage = "url(herz.png)"
					}
					else 
					{
						this.HerzElementArray[i].style.backgroundImage = "url(herzleer.png)"	
					}
				}
				this.SollZeichnen = false
			}

		},
	}


let level =
	[
		{
			layout:
			[
			 [0, 0, 0, 0, 0, 0],
			 [0, 0, 0, 0, 0, 0],
			 [7, 7, 7, 7, 7, 7],
			 [6, 6, 6, 6, 6, 6],
			 [5, 5, 5, 5, 5, 5],
			 [4, 4, 4, 4, 4, 4],
			 [3, 3, 3, 3, 3, 3],
			 [2, 2, 2, 2, 2, 2],
			 [1, 1, 1, 1, 1, 1],
			],
			timer: 9999999999999
		},
		{
			layout:
			[
			 [1, 0, 0, 0, 0, 1],
			 [0, 1, 0, 0, 1, 0],
			 [1, 0, 1, 1, 0, 1],
			 [0, 0, 3, 2, 0, 0],
			 [1, 1, 2, 3, 1, 1],
			 [0, 1, 1, 1, 1, 0],
			 [0, 0, 1, 1, 0, 0],
			 [0, 2, 0, 0, 2, 0],
			 [0, 0, 0, 0, 0, 0],
			],
			timer: 80 * game.logicCalcsPerSecond
		},
		{
			layout:
			[
			 [5, 3, 0, 0, 4, 0],
			 [0, 4, 0, 0, 3, 5],
			 [0, 3, 5, 0, 4, 0],
			 [0, 4, 0, 5, 3, 0],
			 [0, 3, 5, 0, 4, 0],
			 [0, 4, 0, 0, 3, 5],
			 [5, 3, 0, 0, 4, 0],
			 [0, 4, 0, 0, 3, 0],
			 [0, 0, 0, 0, 0, 0],
			],
			timer: 190 * game.logicCalcsPerSecond
		},
		{
			layout:
			[
			 [2, 3, 0, 0, 3, 2],
			 [3, 0, 0, 0, 0, 3],
			 [0, 0, 0, 0, 0, 0],
			 [0, 7, 7, 7, 7, 0],
			 [1, 6, 6, 6, 6, 7],
			 [-1, 1, 1, 1, 1,7],
			 [0, 0, 0, 0, 0, 0],
			 [0, 1, 0, 1, 0, 1],
			 [1, 0, 1, 0, 1, 0],
			],
			timer: 170 * game.logicCalcsPerSecond
		},
		{
			layout:
			[
			 [0, 0, 3, 3, 0, 0],
			 [0, 3, 2, 3, 3, 0],
			 [0, 3, 1, 1, 3, 0],
			 [3, 1, 3, 2, 1, 3],
			 [7, 1, 1, 7, 1, 7],
			 [3, 1, 2, 3, 1, 3],
			 [2, 3, 7, 1, 2, 2],
			 [1, 2, 3, 2, 2, 1],
			 [0, 0, 0, 0, 0, 0],
			],
			timer: 124 * game.logicCalcsPerSecond
		},
		{
			layout:
			[
			 [7, 6, 1, 6, 7, 6],
			 [0, 0, 0, 0, 0, 0],
			 [6, 7, 6, 7, 1, 7],
			 [0, 0, 0, 0, 0, 0],
			 [1, 6, 7, 6, 7, 6],
			 [0, 0, 0, 0, 0, 0],
			 [6, 7, 6, 1, 6, 7],
			 [0, 0, 0, 0, 0, 0],
			 [0, 0, 0, 0, 0, 0],
			],
			timer: 205 * game.logicCalcsPerSecond
		},
		{
			layout:
			[
			 [6, 0, 7, 0, 6, 7],
			 [1, 6, 0, 6, 1, 6],
			 [6, 1, 2, 1, 6, 0],
			 [0, 2, 3, 2, 0, 7],
			 [6, 1, 2, 1, 6, 0],
			 [1, 6, 0, 6, 1, 6],
			 [6, 0, 7, 0, 6, 7],
			 [0, 7, 0, 7, 0, 6],
			 [0, 0, 0, 0, 0, 0],
			],
			timer: 180 * game.logicCalcsPerSecond
		},		
	]

let menue =
	{
		Element: document.getElementById("menuescreen"),
		H1Element : document.getElementById("menueh1"),
		Button: document.getElementById("menuebutton"),
		Text: document.getElementById("menuebrett"),
		Anzeigen(Bildschirm)
		{
			this.Element.style.visibility = "visible"
			this.Button.style.visibility = "visible"
			this.Button.tabindex = "0"
			this.Button.focus()
			switch (Bildschirm)
			{
				case "startbildschirm":
					this.H1Element.textContent = "BRICK BREAKER"
					this.Button.textContent = "SPIEL STARTEN"
					this.Button.onclick = SpielStarten;
					this.Element.style.background = "#A5BE3265"
					break;
				case "gewonnen":
					this.H1Element.textContent = "GEWONNEN"
					this.Button.textContent = "NÄCHSTES LEVEL"
					this.Button.onclick = NaechstesLevelStarten;
					this.Element.style.background = "#A5BE3265"
					break;
				case "verloren":
					this.H1Element.textContent = "VERLOREN"
					this.Button.textContent = "NOCHMAL?"
					this.Button.onclick = LevelWiederholen;
					this.Element.style.background = "#b3151d80"
					break;
				case "abspann":
					this.H1Element.textContent = "VIELEN DANK FÜRS SPIELEN"
					this.Button.style.visibility = "hidden"
					this.Text.innerHTML = "Besonderen Dank an ZUN, Frank Sinatra, Link Kildrim und WHISTLER LUCHITO MEDINA<br><br>\
											FLY ME TO THE MOON  --  WHISTLING COVER  --  FRANK SINATRA<br>\
											PCB Stage 1 Theme - Paradise ~ Deep Mountain - Whistled<br>\
											MoF Stage 3 Theme - The Gensokyo the Gods Loved - Whistled<br>\
											PoDD Mima's Theme - Reincarnation - Whistle Cover<br>\
											Marisa's Theme - Love Coloured Master Spark - Whistled<br>\
											Sakuya's theme Remixed - Night of Nights - Whistled<br>\
											Mokou's Theme - Reach for the Moon ~ Immortal Smoke - Whistle Cover<br>"
					this.Element.style.background = "#ebbf1f80"					
					break;
				default:
					break;
			}
			game.inMenue = true

		},
		Verstecken()
		{
			this.Element.style.visibility = "hidden"
			this.Button.style.visibility = "hidden"
			this.Button.tabindex = "'-1'"
			document.activeElement.blur()
			game.inMenue = false
		},
	}
	
function LevelStarten(levelIndex)
{
	leben.momentaneLeben = leben.maximaleLeben
	leben.SollZeichnen = true
	music.changeBGM(levelIndex)
	menue.Verstecken()
	game.currentlvl = levelIndex
	timer.momentaneZeit = level[levelIndex].timer

	for (let i = 0; i < PlattformArray.length; i++)
	{
		PlattformArray[i].x = 230
		PlattformArray[i].BewegenLinksBedingung = false
		PlattformArray[i].BewegenRechtsBedingung = false
		PlattformArray[i].SollZeichnen = true
	}
	for (let i = 0; i < BallArray.length; i++)
	{
		BallArray[i].ZurueckSetzen()
	}
	for (let i = 0; i < BrickArray.length; i++)
	{
		for (let j = 0; j < BrickArray[i].length; j++)
		{
			BrickArray[i][j].Trefferpunkte = level[levelIndex].layout[j][i]
			BrickArray[i][j].SollZeichnen = true
		}
	}
	game.gewonnen = false
	game.entpausieren()
}

function SpielStarten()
{
	gamecontainer.demoplay = false
	punkte.momentanePunktzahl = 0
	LevelStarten(1)
}

function NaechstesLevelStarten()
{
	LevelStarten(game.currentlvl + 1)	
}

function LevelWiederholen()
{
	LevelStarten(game.currentlvl)
}

function LevelGewonnen()
{
	game.pausieren()
	if(game.currentlvl == level.length - 1)
	{
		menue.Anzeigen("abspann")
		music.changeBGM(0)
		music.Element.volume = 1
		music.Element.play()
	}
	else
	{
		menue.Anzeigen("gewonnen")
	}
}

function LevelVerloren()
{
	punkte.momentanePunktzahl = 0
	game.pausieren()
	menue.Anzeigen("verloren")	
}

function addLeadingNumberZeros(number, totalLength) {
  if (number < 0) {
    const withoutNegativeSign = String(number).slice(1);
    return '-' + withoutNegativeSign.padStart(totalLength, '0');
  }

  return String(number).padStart(totalLength, '0');
}

class Ball
{
    constructor()
    {
        this.x = 200;
        this.y = 200;
        this.flugwinkel = 20;
        this.xGeschwindigkeit = Math.random();
        this.gesamtGeschwindigkeit = 2;
        this.yGeschwindigkeit = this.gesamtGeschwindigkeit * -1;
        //this.gesamtGeschwindigkeit = Math.sqrt(this.xGeschwindigkeit ** 2 + this.yGeschwindigkeit ** 2)
        this.radius = 8;
		this.xkollidiert = false
		this.ykollidiert = false
		
		this.klebend = false
		
		this.boost = 0
		
        this.Element = document.createElement("div");
        this.Element.className = "ball" 
        gamecontainer.Element.appendChild(this.Element);
    }

	ZurueckSetzen()
	{
		this.x = PlattformArray[0].x
		this.y = PlattformArray[0].y + PlattformArray[0].height / 2 + this.radius + this.gesamtGeschwindigkeit
		this.klebend = true
		this.klebendePlattform = PlattformArray[0]
		game.brokenbricks = 0
        this.xGeschwindigkeit = Math.random();
        this.gesamtGeschwindigkeit = 2;
        this.yGeschwindigkeit = this.gesamtGeschwindigkeit - this.xGeschwindigkeit;
	}
	
	
	
    Abprallen()
    {
		//~ if (this.skipnextcheck == true)
		//~ {
			//~ this.skipnextcheck = false
			//~ return
		//~ }
		this.xkollidiert = false
		this.ykollidiert = false

		
        //rand
        //links
        if(this.x - this.radius < 0)
        {
            this.xkollidiert = true
            //this.x = 0
        }
        //rechts
        if(this.x + this.radius > gamecontainer.width)
        {
            this.xkollidiert = true
            //this.x = 450;
        }
        //oben
        if(this.y + this.radius > gamecontainer.fieldheight)
        {
            this.ykollidiert = true
            //this.y = 800
        }
        //unten
        if (this.y - this.radius < 0)
        {
            this.ykollidiert = true
            //this.y = 0    
            leben.LebenVerlieren()
            this.ZurueckSetzen()
        }

        //gesteuerteplattform
        //HIER WICHTIG
        
        PlattformArray.forEach(einPlattform => {
			if(
				this.x + this.radius > einPlattform.x - einPlattform.width / 2 && 
				this.x - this.radius < einPlattform.x + einPlattform.width / 2 &&
				

				this.y + this.radius > einPlattform.y - einPlattform.height / 2 && 
				this.y - this.radius < einPlattform.y + einPlattform.height / 2
				//~ (
					//~ Math.abs(einPlattform.y + einPlattform.height / 2 - this.y) <= this.radius ||
					//~ Math.abs(einPlattform.y - einPlattform.height / 2 - this.y) <= this.radius 
				//~ ) 
				//~ ||
				//~ (
					//~ Math.abs(einPlattform.x + einPlattform.width / 2 - this.x) <= this.radius ||
					//~ Math.abs(einPlattform.x - einPlattform.width / 2 - this.x) <= this.radius 
				//~ )
			  )
                    
                    
                    {
                        /*
                        //linkefläche
                        if(this.x > einPlattform.x)
                        {
                            this.yGeschwindigkeit *= -1;
                        }
                        //rechtefläche
                        else
                        {
                            this.yGeschwindigkeit *= -1;   
                            this.xGeschwindigkeit *= -1;
                        }*/
                        let tempY = this.y - einPlattform.y + einPlattform.height / 2
                        let tempX = this.x - einPlattform.x
                        //let tempFaktor =  this.gesamtGeschwindigkeit / Math.sqrt(tempX ** 2 + tempY ** 2)
                        let tempGesamt = Math.abs(tempX) + Math.abs(tempY)
                        let tempFaktor = this.gesamtGeschwindigkeit / tempGesamt
                        
                        this.xGeschwindigkeit = tempX * tempFaktor
                        this.yGeschwindigkeit = tempY * tempFaktor
                        
                        this.boost = 50
                        
                    }
                });
		for (let i = 0; i < BrickArray.length; i++)
		{
			for (let j = 0; j < BrickArray[i].length; j++)
			{
				if (BrickArray[i][j].Trefferpunkte != 0)
				{
/*
					let y1 = BrickArray[i][j].y - BrickArray[i][j].height / 2
					let y2 = BrickArray[i][j].y - BrickArray[i][j].height / 2
					let x1 = BrickArray[i][j].x - BrickArray[i][j].width / 2
					let x2 = BrickArray[i][j].x + BrickArray[i][j].width / 2
					
					let a = y1 - y2
					let b = x2 - x1
					let c = x2 * y1 - x1 * y2
					let dist = (Math.abs(a * this.x + b * this.y + c)) / Math.sqrt(a * a + b * b);

					let y1 = BrickArray[i][j].y - BrickArray[i][j].height / 2
					let y2 = BrickArray[i][j].y - BrickArray[i][j].height / 2
					let x1 = BrickArray[i][j].x - BrickArray[i][j].width / 2
					let x2 = BrickArray[i][j].x + BrickArray[i][j].width / 2
					
					let a = 0
					let b = x2 - x1
					let c = x2 * y1 - x1 * y2
					let dist = (Math.abs(b * this.y + c)) / b;
					console.log(dist)

					if (this.radius >= dist)
					{
						console.log("unten")
						this.yGeschwindigkeit *= -1;
						this.kollidiert = true
					}

					if (this.x + this.radius > BrickArray[i][j].x - BrickArray[i][j].width / 2)
					{
						console.log("rechts")
						this.xGeschwindigkeit *= -1;
						this.kollidiert = true				
					}
					if (this.y - this.radius > BrickArray[i][j].y + BrickArray[i][j].height / 2)
					{
						console.log("oben")
						this.yGeschwindigkeit *= -1;
						this.kollidiert = true
					}*/
					BrickArray[i][j].kollidiert = false

					if (this.x + this.radius > BrickArray[i][j].x - BrickArray[i][j].width / 2 &&
						this.x - this.radius < BrickArray[i][j].x + BrickArray[i][j].width / 2 &&
						
						(
							//oben
							this.yGeschwindigkeit < 0 &&
							(j == 0 || BrickArray[i][j-1].Trefferpunkte == 0) &&							
							Math.abs(BrickArray[i][j].y + BrickArray[i][j].height / 2 - this.y) <= this.radius ||
							
							//unten
							this.yGeschwindigkeit > 0 &&
							(j == BrickArray[i].length -1 || BrickArray[i][j+1].Trefferpunkte == 0) &&
							Math.abs(BrickArray[i][j].y - BrickArray[i][j].height / 2 - this.y) <= this.radius)
						)
					{
						this.ykollidiert = true
						BrickArray[i][j].kollidiert = true
					}
					
					else if (this.y + this.radius > BrickArray[i][j].y - BrickArray[i][j].height / 2 &&
						this.y - this.radius < BrickArray[i][j].y + BrickArray[i][j].height / 2 &&
						
						(
							//links
							this.xGeschwindigkeit > 0 &&
							( i == 0 || BrickArray[i-1][j].Trefferpunkte == 0 )&&
							Math.abs(BrickArray[i][j].x - BrickArray[i][j].width / 2 - this.x) <= this.radius ||
							
							//rechts
							this.xGeschwindigkeit < 0 &&
							(i == BrickArray.length - 1 || BrickArray[i+1][j].Trefferpunkte == 0) &&							
							Math.abs(BrickArray[i][j].x + BrickArray[i][j].width / 2 - this.x) <= this.radius)
						)
					{
						this.xkollidiert = true
						BrickArray[i][j].kollidiert = true
					}
										
				}
			}
		}
		for (let i = 0; i < BrickArray.length; i++)
		{
			for (let j = 0; j < BrickArray[i].length; j++)
			{
				if (BrickArray[i][j].kollidiert == true)
				{
					BrickArray[i][j].Kollision()
				}
			}
		}
		
		if (this.xkollidiert == true)
		{
			this.xGeschwindigkeit *= -1
			this.boost = 50
		}         

		if (this.ykollidiert == true)
		{
			this.yGeschwindigkeit *= -1
			this.boost = 50
		}         
    
    }
    
    
    Bewegen()
    {
        this.x += this.xGeschwindigkeit * game.SpielGeschwindigkeitsFaktorBerechnen() * ((this.boost / 100) + 1);
        this.y += this.yGeschwindigkeit * game.SpielGeschwindigkeitsFaktorBerechnen() * ((this.boost / 100) + 1);

        //this.x = this.x + this.geschwindigkeit * Math.cos(this.flugwinkel)
        //this.y = this.y + this.geschwindigkeit * Math.sin(this.flugwinkel)
    }
    Zeichnen()
    {
        //~ this.Element.style.left = (this.x - this.radius) + "px"    
        //~ this.Element.style.bottom = (this.y - this.radius) + "px"
        this.Element.style.transform = "translate(" + (this.x - this.radius) + "px, " + ((this.y - this.radius ) * -1) + "px)"
    }
}

class gesteuertePlattform
{
    Zeichnen()
    {
		if (this.SollZeichnen == true)
		{
			this.Element.style.transform = "translateX(" + (this.x - (this.width / 2))  + "px)"
	        //~ this.Element.style.left = (this.x - (this.width / 2)) + "px";
			this.SollZeichnen = false
		}
    }

    BewegenLinks()
    {
        if (this.x - this.width / 2 > 0)
        {
			this.x -= this.xGeschwindigkeit
			this.SollZeichnen = true
  		}
    }

    BewegenRechts()
    {
        if (this.x + this.width / 2 < 450)
        {
			this.x += this.xGeschwindigkeit
			this.SollZeichnen = true
		}
    }
    MausPruefen()
    {
		if (maus.wurdeBewegt == true && maus.istTouch == false)
		{
			if (maus.x < this.x - this.xGeschwindigkeit)
			{
				this.BewegenLinksBedingung = true
	            this.BewegenRechtsBedingung = false	
			}
			else if (maus.x > this.x + this.xGeschwindigkeit)
			{
				this.BewegenLinksBedingung = false
	            this.BewegenRechtsBedingung = true	
			}
			else
			{
				this.BewegenLinksBedingung = false
	            this.BewegenRechtsBedingung = false	
			}
		}

	}
	DemoPlay()
	{
		BallArray[0].klebend = false
		if (BallArray[0].x + Math.random() * 50 < this.x - this.xGeschwindigkeit)
		{
			this.BewegenLinksBedingung = true
            this.BewegenRechtsBedingung = false	
		}
		else if (BallArray[0].x - Math.random() * 50 > this.x + this.xGeschwindigkeit)
		{
			this.BewegenLinksBedingung = false
            this.BewegenRechtsBedingung = true	
		}
		else
		{
			this.BewegenLinksBedingung = false
            this.BewegenRechtsBedingung = false	
		}
	}
    

    constructor()
    {
        this.width = 100;
        this.height = 25;
        this.x = 230;
        this.y = 40 + this.height / 2;
        this.BewegenLinksBedingung = false
        this.BewegenRechtsBedingung = false
        
        this.xGeschwindigkeit = 2;
        
        this.Element = document.createElement("div");
        this.Element.className = "gesteuerteplattform";
        this.Element.style.width = this.width + "px";
        gamecontainer.Element.appendChild(this.Element);
        
        this.SollZeichnen = true
        
        let self = this;
        document.addEventListener("keydown", function (event)
        {
            if(event.key == 'ArrowLeft')
            {
                //self.BewegenLinksIntervall = setInterval(self.BewegenLinks(), 10)
                self.BewegenLinksBedingung = true
                self.BewegenRechtsBedingung = false
                maus.wurdeBewegt = false				

            }
            if(event.key == 'ArrowRight')
            {
                //self.BewegenRechtsIntervall = setInterval(self.BewegenRechts(), 10)
                self.BewegenRechtsBedingung = true
                self.BewegenLinksBedingung = false				                
				maus.wurdeBewegt = false
            }
            if(event.key == 'Escape')
            {
                //self.BewegenRechtsIntervall = setInterval(self.BewegenRechts(), 10)
                if (game.pausiert == false)
				{
					game.pausieren()
				}
				else
				{
					game.entpausieren()
				}
            }

        });

        document.addEventListener("keyup", function (event)
        {
            if(event.key == 'ArrowLeft')
            {
                //clearInterval(self.BewegenLinksIntervall)
                self.BewegenLinksBedingung = false

            }
            if(event.key == 'ArrowRight')
            {
                self.BewegenRechtsBedingung = false				
                //clearInterval(self.BewegenRechtsIntervall)
            }
        });
        
		document.addEventListener("keypress", function (event)
        {
            if(event.key == ' ' || event.key == 'Enter')
            {
				for (let i = 0; i < BallArray.length; i++)
				{
					if (BallArray[i].klebend == true && BallArray[i].klebendePlattform == self)
					{
						BallArray[i].klebend = false
					}
				}
			}
        });
        //~ gamecontainer.Element.addEventListener("mousemove", function (event)
        //~ {
            //~ maus.x = event.offsetX
            //~ maus.wurdeBewegt = true
        //~ });
        //~ gamecontainer.Element.addEventListener("touchmove", function (event)
        //~ {
			//~ console.log(event)
			//~ event.preventDefault()
            //~ maus.x = event.changedTouches[0].clientX / game.scale + gamecontainer.Element.offsetLeft;
            //~ maus.wurdeBewegt = true
        //~ });
        gamecontainer.Element.addEventListener("touchstart", function (event)
        {
			if(game.inMenue == false)
			{
				event.preventDefault()
			}
			//~ console.log(event)
			
			
			if (event.changedTouches[0].clientX / game.scale < gamecontainer.width / 2)
			{
                self.BewegenLinksBedingung = true
                self.BewegenRechtsBedingung = false
			}
			if (event.changedTouches[0].clientX / game.scale > gamecontainer.width / 2)
			{
				self.BewegenRechtsBedingung = true
                self.BewegenLinksBedingung = false
			}
			maus.istTouch = true

        });
        gamecontainer.Element.addEventListener("mousedown", function (event)
        {
			for (let i = 0; i < BallArray.length; i++)
			{
				if (BallArray[i].klebend == true && BallArray[i].klebendePlattform == self)
				{
					BallArray[i].klebend = false
				}
			}
			
		});
        gamecontainer.Element.addEventListener("touchend", function (event)
        {
			if(game.inMenue == false)
			{
				event.preventDefault()
			}
			
			for (let i = 0; i < BallArray.length; i++)
			{
				if (BallArray[i].klebend == true && BallArray[i].klebendePlattform == self)
				{
					BallArray[i].klebend = false
					//~ return
				}
			}

			self.BewegenLinksBedingung = false
			self.BewegenRechtsBedingung = false
			maus.istTouch = true
        });
        gamecontainer.Element.addEventListener("mousemove", function (event)
        {
			event.preventDefault()
            maus.x = event.offsetX
            maus.wurdeBewegt = true
        });
        
    }
}

class Brick
{
	Kollision()
	{
		if (this.Trefferpunkte < 0)
		{
			music.playSFX(2)
		}
		
		if (this.Trefferpunkte > 0)
		{
			punkte.momentanePunktzahl += this.Trefferpunkte * 5
			punkte.SollZeichnen = true		
			music.playSFX(1)
			this.Trefferpunkte -= 1

			if (this.Trefferpunkte == 0)
			{
				game.brokenbricks++
			}
			this.SollZeichnen = true
		}
		
	}
	
	Zeichnen()
	{
		if (this.SollZeichnen == true)
		{
			switch (this.Trefferpunkte)
			{
				case 0:
					//~ this.Element.style.visibility = "hidden"
					this.Element.style.background = "#00000000"					
					break;
				case -1: 
					this.Element.style.background = "grey"
					//~ this.Element.style.visibility = "visible"
					break;
				case 1: 
					this.Element.style.background = "red"
					//~ this.Element.style.visibility = "visible"
					break;
				case 2: 
					this.Element.style.background = "orange"
					//~ this.Element.style.visibility = "visible"
					break;
				case 3: 
					this.Element.style.background = "yellow"
					//~ this.Element.style.visibility = "visible"
					break;
				case 4: 
					this.Element.style.background = "green"
					//~ this.Element.style.visibility = "visible"
					break;
				case 5: 
					this.Element.style.background = "blue"
					//~ this.Element.style.visibility = "visible"
					break;
				case 6: 
					this.Element.style.background = "purple"
					//~ this.Element.style.visibility = "visible"
					break;
				case 7: 
					this.Element.style.background = "pink"
					//~ this.Element.style.visibility = "visible"
					break;
				case 8: 
					this.Element.style.background = "grey"				
					//~ this.Element.style.visibility = "visible"
					break;
				case 9: 
					this.Element.style.background = "grey"				
					//~ this.Element.style.visibility = "visible"
					break;
				case 10: 
					this.Element.style.background = "grey"
					this.Element.style.visibility = "visible"
					break;

			}
			this.SollZeichnen = false
		}
		
	}
	
	constructor(i, j)
	{
		this.width = 75;
        this.height = 60;
        this.border = 0;

		this.x = (i * this.width) + this.width / 2 
		this.y = gamecontainer.fieldheight - (j * this.height) - this.height / 2
        
		this.Trefferpunkte = 7 - j
		this.Element = document.createElement("div");
        this.Element.className = "brick";
        gamecontainer.Element.appendChild(this.Element);
        
        this.Element.style.width = (this.width - this.border) + "px";
        this.Element.style.border = "solid black " + this.border + "px"
        this.Element.style.height = (this.height - this.border) + "px";
        this.Element.style.left = (this.x - (this.width / 2)) + "px";
        this.Element.style.bottom = (this.y - (this.height / 2)) + "px";
        
        this.SollZeichnen = true


	}
}

BallArray = []
BallArray[0] = new Ball()

PlattformArray = []
PlattformArray[0] = new gesteuertePlattform()

BrickArray = [6]
for (let i = 0; i < 6; i++)
{
	BrickArray[i] = [9]
	for (let j = 0; j < 9; j++)
	{
		BrickArray[i][j] = new Brick(i, j)
	}
}
leben.HerzElementArrayFuellen()



function GameLoop()
{
	if(game.pausiert == false)
	{
	    BallArray.forEach(einzelnerBall => {
	        einzelnerBall.Zeichnen()
	    });
		
	    PlattformArray.forEach(einzelnePlattform => {
			einzelnePlattform.Zeichnen()
		});
		
		for (let i = 0; i < BrickArray.length; i++)
		{
			for (let j = 0; j < BrickArray[i].length; j++)
			{
				BrickArray[i][j].Zeichnen()
			}
		}
		leben.Zeichnen()
		punkte.Zeichnen()
		timer.Zeichnen()
	}
    window.requestAnimationFrame(GameLoop);

}
function LogicLoop()
{
		if(game.pausiert == false)
		{
			timer.Pruefen()
			
		    BallArray.forEach(einzelnerBall => {
				if (einzelnerBall.boost > 0)
				{
					einzelnerBall.boost --
				}
				if (einzelnerBall.klebend == true)
				{
					if(einzelnerBall.klebendePlattform.BewegenRechtsBedingung == true && einzelnerBall.klebendePlattform.x + einzelnerBall.klebendePlattform.width / 2 < gamecontainer.width)
					{
						einzelnerBall.x += einzelnerBall.klebendePlattform.xGeschwindigkeit
					}
					if(einzelnerBall.klebendePlattform.BewegenLinksBedingung == true && einzelnerBall.klebendePlattform.x - einzelnerBall.klebendePlattform.width / 2 > 0)
					{
						einzelnerBall.x -= einzelnerBall.klebendePlattform.xGeschwindigkeit
					}
				}
				else
				{
			        einzelnerBall.Bewegen()
			        einzelnerBall.Abprallen()
				}
		    });
			
		    PlattformArray.forEach(einzelnePlattform => {
				if(gamecontainer.demoplay == true)
				{
					einzelnePlattform.DemoPlay()
				}
				else
				{
					einzelnePlattform.MausPruefen()
				}
		
				if(einzelnePlattform.BewegenLinksBedingung == true)
				{
					einzelnePlattform.BewegenLinks()
				}
				if(einzelnePlattform.BewegenRechtsBedingung == true)
				{
					einzelnePlattform.BewegenRechts()
				}
			});
		
			punkte.highscorePruefung()
			game.Siegpruefung()
		}

}


LevelStarten(0)
menue.Anzeigen("startbildschirm")
window.requestAnimationFrame(GameLoop);
setInterval(LogicLoop, 1000/game.logicCalcsPerSecond)

//maininterval = setInterval(GameLoop, 33)
