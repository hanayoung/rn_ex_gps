import React from 'react';
import Styled from 'styled-components/native';
import MapView from 'react-native-maps';

const Container = Styled.View`
flex:1;
`;

const InitialRegion=()=>{
    return(
        <Container>
            <MapView
            style={{flex:1}}
            initialRegion={{
                latitude: 37.78825,
                longtitude: -122.4324,
                latitudeDelta: 0.0922,
                longtitudeDelta: 0.0421,
            }}
            />
        </Container>
    );
};

export default InitialRegion;