import PlaceForm from "../components/places/PlaceForm";

function AddPlace({ navigation }) {
    async function createPlaceHandler(place) {
        await insertPlace(place);
        navigation.navigate('AllPlaces', {
            place: place
        })
    }

    return <PlaceForm onCreatePlace={createPlaceHandler} />
}

export default AddPlace;