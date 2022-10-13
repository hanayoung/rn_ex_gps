import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View,TextInput } from 'react-native';
import * as Location from "expo-location";
import {DOMParser} from 'xmldom';
import MapView, {Callout, Marker,Image} from 'react-native-maps';

export default function App() {
    const [initialRegion,setinitialRegion]=useState()
    const [result, setResult] = useState([]);
    const [markers, setMarkers] =useState([]);
    const [station, setStation] = useState('');
 	const ask = async ()=>{
        const {granted} = await Location.requestForegroundPermissionsAsync();
    const {coords: {latitude,longitude}} = await Location.getCurrentPositionAsync({accuracy :5}); //coords를 통해 현재 위치의 좌표 받기
    setinitialRegion({
        latitude:latitude,
        longitude:longitude,
        latitudeDelta:0.02,
        longitudeDelta:0.02
    })
    };
    const handleStation = text => {
        setStation(text);
      };
    const sortArray=async()=>{
        console.log("sort Array called")
        console.log("result",result)
        let arr1=[];
        arr1.push(result); //arr1에 기존 정렬되지 않은 값
        console.log("arr1",arr1);
        let arr=[]; //arr에 정렬한 값
        let dis;
        console.log(initialRegion.longitude);
        for(let j=0;j<arr1.length;j++){
            dis=Math.pow((initialRegion.longitude-Number(arr1[j].y)))+Math.pow((initialRegion.latitude-Number(arr1[j].x)));
            arr.push(dis);
        }
        console.log("arr",arr);
        arr.sort();
        setResult(arr);
        
    }
    const setRegion=async()=>{
        setinitialRegion({
            latitude:Number(result[0].y),
            longitude:Number(result[0].x),
            latitudeDelta:0.002,
            longitudeDelta:0.002
        })
        }
    const searchStation = async()=>{
        try{
          var xhr = new XMLHttpRequest();
          var url = 'http://apis.data.go.kr/6410000/busstationservice/getBusStationList'; /*URL*/
          var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'UkgvlYP2LDE6M%2Blz55Fb0XVdmswp%2Fh8uAUZEzUbby3OYNo80KGGV1wtqyFG5IY0uwwF0LtSDR%2FIwPGVRJCnPyw%3D%3D'; /*Service Key*/
          queryParams += '&' + encodeURIComponent('keyword') + '=' + encodeURIComponent(station); /**/
          xhr.open('GET', url + queryParams);
          xhr.onreadystatechange = function () {
              if (this.readyState == 4) {
              let xmlParser = new DOMParser();
              let xmlDoc = xmlParser.parseFromString(this.responseText, "text/xml");
              let i = 0;
              let array = [];
              while(1){
                var tmpnode = new Object();
                
                tmpnode.index=i;
                tmpnode.id = xmlDoc.getElementsByTagName("stationId")[i].textContent;
                tmpnode.name = xmlDoc.getElementsByTagName("stationName")[i].textContent;
                tmpnode.x = xmlDoc.getElementsByTagName("x")[i].textContent;
                tmpnode.y = xmlDoc.getElementsByTagName("y")[i].textContent;
                array.push(tmpnode);
                
                i++;
                if(xmlDoc.getElementsByTagName("stationId")[i]==undefined) break;
              }
              setResult(array);
               /* console.log("sorting before",result);
                console.log("user",initialRegion.latitude);
                console.log("user2",initialRegion.longitude);
                //sortArray();
                console.log("sorting after",result);
                //setRegion(); */
                console.log("here ",result)
            }
            console.log("here 1 ",result)
          }
        xhr.send();
        console.log("here 2 ",result)
        }
        catch(err){
          alert(err);
        }
        console.log("herer 4",result);
    };
 	useEffect(() => {
        ask();
        searchStation();
        {console.log("after searchStation ",result)}
  	 }, []);
    useEffect(()=>{
        {console.log("in useEffect ",result)}
        sortArray();
        setRegion();
    },[]);

return(
<View style={styles.container}>
<Text style={styles.title}>CatchBus</Text>
<TextInput
style={styles.input}
placeholder='정류장 이름을 입력하세요'
autoCorrect = {false}
     value = {station}
     onChangeText={handleStation}
     onSubmitEditing = {()=>searchStation()}
     multiline={false}
     returnKeyType="search"
      />
    <MapView
        region={initialRegion}
        style={[styles.map]}
        showsUserLocation={true}
        showsMyLocationButton={true}
        >
    {result&&result.map((item)=>{
    return(
    <Marker
    key={item.id}
    title={item.name}
    coordinate={{
        latitude:Number(item.y),
        longitude:Number(item.x),//리턴 해줘야지 마커 뜸
    }}
    >
    <Image 
    source={require(`./assets/googlemaps.png`)}
    style={{width:26,height:28}}
    resizeMode="contain"
    />    
    </Marker>
    );
}
)}
    </MapView>
    </View>
);
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    map:{
        flex:1,
        width:'100%',
        height:'100%'
    },
    bubble:{
        flexDirection:'row',
        alignSelf:'flex-start',
        backgroundColor:'#fff',
        borderRadius:6,
        borderWidth:0.5,
        padding:15,
    },
    title: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
