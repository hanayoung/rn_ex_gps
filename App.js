import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from "expo-location";
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';

export default function App() {
	const [city,setCity] = useState("Loading...");
    const [district, setDistrict]=useState(); //구
    const [location, setLocation] = useState();
 	const [ok, setOk] = useState(true);
    const [initialRegion,setinitialRegion]=useState({
    latitude: 35.91395373474155,
    longitude: 127.73829440215488,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
    })
 	const ask = async ()=>{
        const {granted} = await Location.requestForegroundPermissionsAsync();
        if(!granted){
            setOk(false);
        }
    const {coords: {latitude,longitude}} = await Location.getCurrentPositionAsync({accuracy :5}); //coords를 통해 현재 위치의 좌표 받기
    const location=await Location.reverseGeocodeAsync(
        {latitude,longitude},
        {useGoogleMaps: false}//구글맵지도 사용여부
    );
    console.log(latitude,longitude);
    setCity(location[0].city);
    setDistrict(location[0].district);
    };
 	useEffect(() => {
    	ask();
  	}, []);
return(
<View style={styles.container}>
    <View style={styles.city}></View>
    <Text style={styles.cityName}>{city}</Text>
    <Text style={styles.districtName}>{district}</Text>
    <MapView
    initialRegion={initialRegion}
    style={[styles.map]}
    provider={PROVIDER_GOOGLE}
    showsUserLocation={true}
    showsMyLocationButton={true}
    />
</View>
);
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    city:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize : 50
    },
    cityName:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize : 50
    },
    districtName:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize : 40
    },
    map:{
        flex:1,
        width:'100%',
        height:'100%'
    },
});
