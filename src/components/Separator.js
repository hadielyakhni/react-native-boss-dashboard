import React from 'react'
import { View, Text } from 'react-native'

const Separator = ({ text }) => {
    return (
        <View style={styles.view}>
            <Text style={styles.text}>
                {text}
            </Text>
        </View>
    )
}

const styles = {
    view: {
        height: 26,
        justifyContent: 'center',
        marginLeft: 1
    },
    text: {
        fontSize: 11.5,
        color: '#404040',
        fontWeight: 'bold'
    }
}

export default Separator