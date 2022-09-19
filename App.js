import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from "expo-location";
import {DOMParser} from 'xmldom';
import MapView, {Marker} from 'react-native-maps';

export default function App() {
    const [initialRegion,setinitialRegion]=useState();
    const [result, setResult] = useState([]);
    const [markers, setMarkers] =useState([]);
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
    const searchStation = async()=>{
        console.log("search")
        try{
          var xhr = new XMLHttpRequest();
          var url = 'http://apis.data.go.kr/6410000/busstationservice/getBusStationList'; /*URL*/
          var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'UkgvlYP2LDE6M%2Blz55Fb0XVdmswp%2Fh8uAUZEzUbby3OYNo80KGGV1wtqyFG5IY0uwwF0LtSDR%2FIwPGVRJCnPyw%3D%3D'; /*Service Key*/
          queryParams += '&' + encodeURIComponent('keyword') + '=' + encodeURIComponent('아주대병원'); /**/
          xhr.open('GET', url + queryParams);
          xhr.onreadystatechange = function () {
              if (this.readyState == 4) {
              let xmlParser = new DOMParser();
              let xmlDoc = xmlParser.parseFromString(this.responseText, "text/xml");
              let i = 0;
              while(1){
                var tmpnode = new Object();
                
                console.log(i)
                tmpnode.id = xmlDoc.getElementsByTagName("stationId")[i].textContent;
                tmpnode.name = xmlDoc.getElementsByTagName("stationName")[i].textContent;
                tmpnode.x = xmlDoc.getElementsByTagName("x")[i].textContent;
                tmpnode.y = xmlDoc.getElementsByTagName("y")[i].textContent;
                
               result.push(tmpnode);
                setResult(result);
              
                i++;
                if(xmlDoc.getElementsByTagName("stationId")[i]==undefined) break;
              }
            }
          }
        xhr.send();
        }
        catch(err){
          alert(err);
        }
    };
    const printMarker=async()=>{
        const resultMarker=result.map((markerItem)=>{
            return{
                key:markerItem.id,
                coordinate:{
                    latitude:markerItem.y,
                    longitude:markerItem.x
                },
            };
        });
        setMarkers(resultMarker);
    }
 	useEffect(() => {
    	ask();
  	 }, []);
    searchStation()
    .then(printMarker)
    .catch("err");
return(
<View style={styles.container}>
<MapView
    region={initialRegion}
    style={[styles.map]}
    showsUserLocation={true}
    showsMyLocationButton={true}
    >
    <Marker
    coordinate={{
        latitude:37.2783333,
        longitude:127.046866
    }}
/>
{markers.map((item)=>{
    <Marker
    key={item.key}
    coordinate={item.coordinate}
/>
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
});
