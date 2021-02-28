import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class NotificationScreen extends Component{
    constructor(props){
        super(props);
        this.state={
            userId:firebase.auth().currentUser.email,
            allNotifications:[]
        }
        this.notificationRef = null;
    }

getNotifications=()=>{
    this.requestRef = db.collection("all_notifications")
    .where("notifiction_status","==","unread")
    .where("targeted_user_id","==",this.state.userId)
    .onSnapshot((snapshot)=>{
        var allNotifications = [];
        snapshot.docs.map((doc)=>{
            var notification = doc.data()
            notification["doc_id"] = doc.id
            allNotifications.push(notification)
        })
        this.setState({
            allNotifications:allNotifications
        })
    })
  }

componentDidMount(){
    this.getNotifications()
}

componentWillUnmount(){
    this.notificationRef()
}

keyExtractor=(item,index)=>index.toString()
renderItem=({item,index})=>{
    return(
     <ListItem
        key={i}
        bottomDivider>
        <ListItem.Content>
            <ListItem.Title>
                {item.itemName}
            </ListItem.Title>
            <Icon name="Item" type="font-awesome" color="#696969"/>
        </ListItem.Content>
      </ListItem>
    )
}

render(){
    return(
        <View style={{flex:1}}>
            <View style={{flex:0.1}}>
                <MyHeader Title={"Notifications"}
                navigation = {this.props.navigation}
                />
            </View>
            <View style={{flex:0.9}}>
                {
                    this.state.allNotifications.length === 0?
                    (
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:25}}>
                                You have no notifications
                            </Text>
                        </View>
                    )
                    :
                    (
                        <FlatList
                        keyExtractor={this.keyExtractor}
                        data={this.state.allNotifications}
                        renderItem={this.renderItem}
                        />
                    )
                }
            </View>
        </View>
    )
}

}