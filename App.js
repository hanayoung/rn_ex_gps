import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from "expo-location";
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';

export default function App() {
    const [city,setCity]=useState();
    const [district,setDistrict]=useState();
    const [location, setLocation] = useState();
    const [coords,setCoords]=useState();
 	const [ok, setOk] = useState(true);
    const [initialRegion,setinitialRegion]=useState();
 	const ask = async ()=>{
        const {granted} = await Location.requestForegroundPermissionsAsync();
        if(!granted){
            setOk(false);
        }
    const {coords: {latitude,longitude}} = await Location.getCurrentPositionAsync({accuracy :5}); //coords를 통해 현재 위치의 좌표 받기
    const tmpcoords=await {latitude,longitude};
    setCoords(tmpcoords);
    const location=await Location.reverseGeocodeAsync(
        {latitude,longitude},
        {useGoogleMaps: false}//구글맵지도 사용여부
    );
    setLocation(location);
    if(location[0].city!=null){
    setCity(location[0].city);
    }
    else{
        setCity(location[0].region)
    }
    setDistrict(location[0].district);
    setinitialRegion({
        latitude:tmpcoords.latitude,
        longitude:tmpcoords.longitude,
        latitudeDelta:0.02,
        longitudeDelta:0.02
    })
    };
 	useEffect(() => {
    	ask();
  	}, []);
return(
<View style={styles.container}>
    <View style={styles.city}></View>
    <Text style={styles.city}>{city}</Text>
    <Text style={styles.districtName}>{district}</Text>
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
    title="this is a marker"
    description='this is a marker example'
/>
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
