import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import stars from "./stars.png"
import pegabuff from "./pegabufficorn.png"
import pegabuff2 from "./pegabufficorn2.png"
import trees from "./trees.png"
import qrscan from "./qrscan.png"
import profile from "./profile.png"
import xpmeter from "./xpmeter.png"
import valuehud from "./valuehud.png"

import './App.css';

const STARTLOGGEDIN = false
const SHOWOWOCKI = false
const SHOWBOUNTIES = false

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([Math.min(900,window.clientWidth || window.innerWidth), window.clientHeight || window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

var context = require.context('./mountains', true, /\.(png)$/);
var mountainsFiles={};
context.keys().forEach((filename)=>{
  mountainsFiles[filename] = context(filename);
});
console.log(mountainsFiles);



var context = require.context('./denver', true, /\.(png)$/);
var cityFiles={};
context.keys().forEach((filename)=>{
  cityFiles[filename] = context(filename);
});
console.log(cityFiles);



var context = require.context('./castle', true, /\.(png)$/);
var castleFiles={};
context.keys().forEach((filename)=>{
  castleFiles[filename] = context(filename);
});
console.log(castleFiles);



const drawLayer = (index,img,width,left,top,perspective,opacity,scaleY,brightness,extraComponents)=>{
  let thisOpacity = 0.99
  if(typeof opacity != "undefined"){
      thisOpacity = opacity
  }

  if(thisOpacity==1){
  thisOpacity = 0.99
  }

  let thisScaleY = 1.0
  if(typeof scaleY != "undefined"){
    thisScaleY = scaleY
  }

  let thisBrightness = 100
  if(typeof brightness != "undefined"){
    thisBrightness = brightness
  }

  let thisTransform = "perspective( "+perspective+"px ) rotateX( -5deg ) scaleY( "+thisScaleY+" ) "
  //console.log("thisTransform",thisTransform)
  return (
    <div key={"layer"+img} style={{zIndex:index,position:"absolute",left:Math.floor(left),top:Math.floor(top),opacity:thisOpacity}}>
      <img src={img} style={{filter:"brightness("+thisBrightness+"%)",transform:thisTransform,WebkitTransform:thisTransform,width:Math.floor(width)}}/>
      {extraComponents}
    </div>
  )
}


function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function App() {
  const [openedBuilding, setOpenedBuilding] = useState(STARTLOGGEDIN);
  const [loggedIn, setLoggedIn] = useState(STARTLOGGEDIN);

  const [mode, setMode] = useState(0);

  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  const listener = e => {
    setScrollY(window.scrollY)
    setScrollX(window.scrollX)
  };

  useInterval(() => {
    // Your custom logic here
    setMode(!mode)
  }, 50);

  useEffect(() => {
    window.addEventListener("scroll", listener);
    return () => {
      window.removeEventListener("scroll", listener);
    };
  });

  const [width, height] = useWindowSize();

  const screenRatio = 7/1
  const rightScrollBarOffset = 15
  let adjustedHeight = height*screenRatio
  let bottom = height+scrollY
  let scrollPercent = Math.round(scrollY / (adjustedHeight-height) * 100)
  if(!scrollPercent) scrollPercent = 0
  scrollPercent = Math.max(scrollPercent,0)
  scrollPercent = Math.min(scrollPercent,100)
  //console.log("scrollPercent",scrollPercent)

  let layers = []

  const rangePercent = (percent,finish,start) => {
    return ((start-finish)*(percent/100))+finish
  }

  let layerWidth = rangePercent(scrollPercent,width*2,width*1.1)


  let layerLeft = rangePercent(scrollPercent,layerWidth*0.2,layerWidth*0.05)


  let mountainWidth = rangePercent(scrollPercent,width*1.6,width*1.1)
  let mountainsTop = rangePercent(scrollPercent,height*0.35,height*0.01)
  let mountainPerspective = rangePercent(scrollPercent,layerWidth*0.15,layerWidth*0.2)

  let layerCount = 1

  let mountainOverOpacity = Math.min(0.7,rangePercent(scrollPercent,0,10))

  if(scrollPercent>80){
    mountainOverOpacity = 0.0
  }

  let mountainDistance = 0.08 - scrollPercent/100 * 0.08

  layers.push(drawLayer(layerCount++,mountainsFiles["./undermountains.png"],mountainWidth,-layerLeft-scrollX*mountainDistance,mountainsTop,mountainPerspective,rangePercent(scrollPercent,0.99,0)))
  //layers.push(drawLayer(layerCount++,mountainsFiles["./mountains.png"],mountainWidth,-layerLeft-scrollX*mountainDistance,mountainsTop,mountainPerspective,rangePercent(scrollPercent,0.99,0)))

  layers.push(drawLayer(layerCount++,mountainsFiles["./mountainsFull.png"],mountainWidth,-layerLeft-scrollX*mountainDistance,mountainsTop,mountainPerspective,rangePercent(scrollPercent,0.99,0)))
  layers.push(drawLayer(layerCount++,mountainsFiles["./overmountains.png"],mountainWidth,-layerLeft-scrollX*mountainDistance,mountainsTop,mountainPerspective,mountainOverOpacity))

  let foothillsDistance = 0.16 - scrollPercent/100 * 0.16

  let foothillsTop = rangePercent(scrollPercent,height*0.24,-height*0.08)
  let foothillsPerspective = rangePercent(scrollPercent,layerWidth*0.05,layerWidth*0.2)
  layers.push(drawLayer(
    layerCount++,
    mountainsFiles["./foothills.png"],
    layerWidth,
    -layerLeft-scrollX*foothillsDistance,
    foothillsTop,
    foothillsPerspective,
    0.99,
    1,
    rangePercent(scrollPercent,100,50)
  ))

  let cityDistance = 0.6 - scrollPercent/100 * 0.3

  let cityWidth = layerWidth

  let cityLeft = rangePercent(scrollPercent,layerWidth*0.08,layerWidth*0.05)
  let cityOffset = rangePercent(scrollPercent,-height*0.1,-height*0.05)

  let cityPerspective = rangePercent(scrollPercent,layerWidth*0.09,layerWidth*0.2)
  let cityTop = rangePercent(scrollPercent,height*0.3,height*0.02)
  layerCount = 10
  /*for(let i in cityFiles){
    layers.push(drawLayer(layerCount++,cityFiles[i],cityWidth,rangePercent(scrollPercent,cityOffset-cityLeft-cityDistance*scrollX,-cityLeft),cityTop,cityPerspective,0.99,rangePercent(scrollPercent,1.4,0.8)))
  }*/
  layers.push(drawLayer(
    layerCount++,
    cityFiles["./cityFull.png"],
    cityWidth,
    rangePercent(scrollPercent,cityOffset-cityLeft-cityDistance*scrollX,-cityLeft),
    cityTop,
    cityPerspective,
    0.99,
    rangePercent(scrollPercent,1.2,0.8),
    rangePercent(scrollPercent,100,70)
  ))

  //if(scrollPercent < 20 || scrollPercent > 80){
    let treesDistance = 0.8 - scrollPercent/100 * 0.2

    let treesTop = rangePercent(scrollPercent,height*0.75,height*0.2)
    let treesPerspective = rangePercent(scrollPercent,layerWidth*0.3,layerWidth*0.7)
  //(index,img,width,left,top,perspective,opacity,scaleY,brightness,extra)
    layers.push(drawLayer(
      layerCount++,
      trees,
      layerWidth,
      rangePercent(scrollPercent,cityOffset-cityLeft-treesDistance*scrollX,-cityLeft),
      treesTop,
      treesPerspective,
      1.0,
      0.88,
      rangePercent(scrollPercent,100,20)
    ))
  //}



  let sidewalkPerspective = rangePercent(scrollPercent*1.2,layerWidth*0.15,layerWidth)

  let scrollOffsetBuilding = -50

  const STARTSCROLLINGAT = 65

  if(scrollPercent>STARTSCROLLINGAT){
    let thisScroll = (scrollPercent-STARTSCROLLINGAT)*100/(100-STARTSCROLLINGAT)
    //console.log("thisscroll",thisScroll)
    scrollOffsetBuilding += thisScroll*6.2
  }

  let sidewalkDivider = 2

  let exploded = false

    let coverMax = rangePercent(scrollPercent,height*0.8,-height)
    let sidewalkBottom = coverMax
    let lowbound = height*0.4
    /*if(coverMax>lowbound && coverMax < height*0.6){
      coverMax=height*0.5
      sidewalkBottom=coverMax
    }*/

  if(loggedIn && sidewalkBottom < height*0.5){
    exploded = true
    sidewalkBottom = rangePercent(scrollPercent,height*0.5333,height*0.7)
    sidewalkDivider = 1
  }

  layerLeft+=scrollX


  let castleBackTop = coverMax+scrollOffsetBuilding/2+15 // Math.max(height*0.2,coverMax+scrollOffsetBuilding/2+15)

    //layerLeft-=scrollX
    layers.push(drawLayer(layerCount++,castleFiles["./castleBack.png"],layerWidth,-layerLeft,castleBackTop,sidewalkPerspective,0.99))

    /*layers.push(
      <div style={{zIndex:layerCount,position:"absolute",top:0,width:"100%",height:height*screenRatio,backgroundColor:"#4d4d4d"}}>
      </div>
    )*/
    //layers.push(
    //console.log(exploded,scrollX,layerLeft)


  layerCount = 50
  layers.push(drawLayer(layerCount++,castleFiles["./1_sidewalk.png"],layerWidth,-layerLeft,6+sidewalkBottom+scrollOffsetBuilding/sidewalkDivider,sidewalkPerspective))



  /*
  layers.push(
  <div style={{position:"absolute",left:0,top:0}}>
  <img src={"./mountains.png"} />
  </div>
  )
  layers.push(
  <div style={{position:"absolute",left:0,top:0}}>
  <img src={"./foothills.png"} />
  </div>
  )
  layers.push(
  <div style={{position:"absolute",left:0,top:0}}>
  <img src={"./city_dark.png"} />
  </div>
  )*/

  //,backgroundImage:"linear-gradient(white, black)"}

  //layers.reverse()


  let buildingLayerSpread = 0.22


  const questButton = (location,color,task,xp)=>{
    return (
      <div style={{position:"relative",zIndex:999,cursor:"pointer",width:"80%"}} onClick={()=>{
          alert("click")
      }}>
        <div style={{margin:4,zIndex:999,padding:"6",backgroundColor:"#EEEEEE",borderRadius:6,borderBottom:"4px solid #9d9d9d"}}>
          <span style={{verticalAlign:"middle",color:"#444444",fontSize:"26"}} className={"title"}><span style={{color:color}}>{location}: </span> {task}</span>
        </div>
        <div style={{zIndex:999,position:"absolute",right:8,top:0, opacity:0.5}}>
          +{xp} XP
        </div>
      </div>
    )
  }


  let layer1Bottom = coverMax
  if(layer1Bottom < height*0.5){
    layer1Bottom = Math.max(height*0.6,rangePercent(scrollPercent,height*0.82,-height*0.5))
  }

  if(!exploded){
    layer1Bottom += 7*screenRatio
  }else{
    layer1Bottom -= 3*screenRatio
  }



  if(!openedBuilding || !exploded){
    layers.push(drawLayer(layerCount++,castleFiles["./floor1_preview.png"],layerWidth,-layerLeft,layer1Bottom+scrollOffsetBuilding,sidewalkPerspective))
  }else{


    const buttonBoxStyle = {zIndex:999,position:"absolute",left:width*1.1,top:0,width:width*0.9,height:"60%",marginTop:"10%"}


    let floor1Buttons = (
      <div style={buttonBoxStyle}>

        {questButton("Front Desk","#575b87","Check in to venue",50)}

        {questButton("Art Gallery","#cfa286","Bid on artwork",100)}

        {questButton("Coat Check","#57877b","Check Coat",25)}

      </div>
    )
    //(index,img,width,left,top,perspective,opacity,scaleY,brightness,extra)
    layers.push(drawLayer(layerCount++,castleFiles["./floor1.png"],layerWidth,-layerLeft,layer1Bottom+scrollOffsetBuilding,sidewalkPerspective,1,1,100,floor1Buttons))


    let layer2Bottom = coverMax
    let stickPointLayer2 = layer1Bottom - height * buildingLayerSpread



    if(!SHOWOWOCKI){

      if(layer2Bottom < stickPointLayer2*(0.8) ){
        layer2Bottom = stickPointLayer2
        let floor2Buttons = (
          <div style={buttonBoxStyle}>

          </div>
        )
        layers.push(drawLayer(layerCount++,castleFiles["./floor2.png"],layerWidth,-layerLeft,layer2Bottom+scrollOffsetBuilding,sidewalkPerspective,1,1,100,floor2Buttons))
      }
    }else{

      if(layer2Bottom < stickPointLayer2*(0.8) ){
        layer2Bottom = stickPointLayer2
        let floor2Buttons = (
          <div style={buttonBoxStyle}>
            {questButton("Owacki Sacki","#7381b5","Talk OSS",75)}
          </div>
        )
        layers.push(drawLayer(layerCount++,castleFiles["./floor2_owocki.png"],layerWidth,-layerLeft,layer2Bottom+scrollOffsetBuilding,sidewalkPerspective,1,1,100,floor2Buttons))
      }
    }


    let layer3Bottom = coverMax
    let stickPointLayer3 = layer2Bottom - height * buildingLayerSpread*1.2

    if(layer3Bottom < stickPointLayer3 ){
      layer3Bottom = stickPointLayer3
      layers.push(drawLayer(layerCount++,castleFiles["./floor3.png"],layerWidth,-layerLeft,layer3Bottom+scrollOffsetBuilding,sidewalkPerspective))
    }


    let layer4Bottom = coverMax
    let stickPointLayer4 = layer3Bottom - height * buildingLayerSpread

    if(layer4Bottom < stickPointLayer4 ){
      layer4Bottom = stickPointLayer4
      layers.push(drawLayer(layerCount++,castleFiles["./floor4.png"],layerWidth,-layerLeft,layer4Bottom+scrollOffsetBuilding,sidewalkPerspective))
    }

    let layer5Bottom = coverMax
    let stickPointLayer5 = layer4Bottom - height * buildingLayerSpread


    if(SHOWBOUNTIES){
      if(layer5Bottom < stickPointLayer5 ){
        let floor5Buttons = (
          <div style={buttonBoxStyle}>
            {questButton("Bounties Network","#f1c673","Mimosas with Simona",95)}
          </div>
        )
        layer5Bottom = stickPointLayer5
        layers.push(drawLayer(layerCount++,castleFiles["./floor5_wtf.png"],layerWidth,-layerLeft,layer5Bottom+scrollOffsetBuilding,sidewalkPerspective,1,1,100,floor5Buttons))
      }
    }else{
      if(layer5Bottom < stickPointLayer5 ){
        let floor5Buttons = (
          <div style={buttonBoxStyle}>

          </div>
        )
        layer5Bottom = stickPointLayer5
        layers.push(drawLayer(layerCount++,castleFiles["./floor5.png"],layerWidth,-layerLeft,layer5Bottom+scrollOffsetBuilding,sidewalkPerspective,1,1,100,floor5Buttons))
      }
    }


    let layer6Bottom = coverMax
    let stickPointLayer6 = layer5Bottom - height * buildingLayerSpread
    if(layer6Bottom < stickPointLayer6 ){
      layer6Bottom = stickPointLayer6
      layers.push(drawLayer(layerCount++,castleFiles["./floor6.png"],layerWidth,-layerLeft,layer6Bottom+scrollOffsetBuilding,sidewalkPerspective))
    }

  }



  layers.push(drawLayer(layerCount++,castleFiles["./castleFull.png"],layerWidth,-layerLeft,coverMax+scrollOffsetBuilding/2,sidewalkPerspective))

  //scrollY>0?(width-1)*1.8:width-1
  //
  //<div style={{zIndex:3,backgroundColor:"#282828",width:width,height:height,position:"fixed",top:rangePercent(scrollPercent,height*0.8,height*0.18)}}></div>
  //
  //

  let buffImage = mode?pegabuff:pegabuff2

  return (
    <div style={{width:"100%",textAlign:"center",backgroundColor:"#000000"}}>

      <div style={{filter:"drop-shadow(0px 0px 4px #222222)",zIndex:999,position:"fixed",top:15,right:0}}>
        <img src={profile} style={{maxWidth:180}}></img>
      </div>

      <div style={{filter:"drop-shadow(0px 0px 4px #222222)",zIndex:999,position:"fixed",top:69,right:0}}>
        <img src={xpmeter} style={{maxWidth:130}}></img>
      </div>

      <div style={{filter:"drop-shadow(0px 0px 4px #222222)",zIndex:999,position:"fixed",top:10,left:0}}>
        <img src={valuehud} style={{maxWidth:130}}></img>
      </div>

      <div style={{margin:"0 auto",height:!loggedIn?height*1.9:height*screenRatio,width:(width-1)*1.8,overflow:"hidden"}}>

        <div style={{filter:"drop-shadow(0px 0px 4px #222222)",zIndex:999,position:"fixed",bottom:-20,right:"15%",width:100,height:100,background:"linear-gradient(#b75fac, #a24c97)",borderRadius:80}}>
          <img src={qrscan} style={{width:"80%",height:"80%",marginTop:5}}></img>
        </div>

        <div className={"sky-gradient-06"} style={{backgroundColor:"#FFFFFF",width:width,height:height*0.85,position:"fixed",top:rangePercent(scrollPercent,-height*0.2,0)}}>
          <img src={stars} style={{minWidth:width}} />
        </div>

        <div className={"title"} style={{position:"fixed",top:height*0.09-scrollY/3,width:width,height:height,overflow:"hidden"}}>
          <div style={{color:"#efefef",fontSize:"30pt"}}>B<span style={{color:"#efefef",fontSize:"28pt"}}>UFFI</span>DAO</div>
          <div style={{color:"#adadad",fontSize:"12pt"}}>ETHDENVER 2020</div>
        </div>


        {!loggedIn?
        <div style={{cursor:"pointer",position:"absolute",left:scrollX,top:height*1.333,zIndex:999,width:"100%"}} onClick={()=>{
          setLoggedIn(true)
          setTimeout(()=>{
            window.scrollTo({
              top: height*1.33,
              left: width*0.1,
              behavior: 'smooth'
            });
            setOpenedBuilding(true)
          },30)

        }}>
          <div style={{margin:"0 auto",width:"77%",padding:"5%",backgroundColor:"#EEEEEE",borderRadius:6,borderBottom:"4px solid #9d9d9d"}}>
            <span style={{verticalAlign:"middle",color:"#444444",fontSize:"9vw"}} className={"title"}> ⚔️ Start Questing...</span>
          </div>
        </div>:""}



        <div style={{position:"fixed",top:height*0.1,width:width,height:height*screenRatio}}>
          {layers}
          <div style={{zIndex:255,position:"absolute",right:scrollX/2,top:rangePercent(scrollPercent,0,-height*0.8)}}>
            <img src={buffImage} style={{maxWidth:width/1.5}} />
          </div>
        </div>

        <div style={{position:"relative",width:width,height:adjustedHeight,overflow:"hidden"}}>
        </div>



      </div>



    </div>
  );
}

export default App;
