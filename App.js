import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View,TextInput } from 'react-native';
import * as Location from "expo-location";
import {DOMParser} from 'xmldom';
import MapView, {Callout, Marker,Image} from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons'; 

export default function App() {
    const [initialRegion,setinitialRegion]=useState()
    const [result, setResult] = useState([]);
    const [markers, setMarkers] =useState([]);
    const [station, setStation] = useState('');
    const pinColor='#000000';
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
    const handleResult=(arr)=>{
        console.log("before sort",arr);
        arr.sort(function(a,b){
            return a.dis-b.dis;
        });
        console.log("after sort",arr);
        setResult(arr);
        setRegion(arr[0].x,arr[0].y);
    }
    const setRegion=(x,y)=>{
        setinitialRegion({
            latitude:Number(y),
            longitude:Number(x),
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
                console.log("위도 경도",initialRegion.longitude);
                tmpnode.dis=Math.pow((initialRegion.longitude-tmpnode.x),2)+Math.pow((initialRegion.latitude-tmpnode.y),2);
                array.push(tmpnode);
                i++;
                if(xmlDoc.getElementsByTagName("stationId")[i]==undefined) break;
              }
              handleResult(array);
            }
          }
        xhr.send();
        }
        catch(err){
          alert(err);
        }
    };
 	useEffect(() => {
        ask();
        searchStation();
  	 }, []);

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
     
     <FontAwesome name="map-marker" size={30} color="#0067A3"/>
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
