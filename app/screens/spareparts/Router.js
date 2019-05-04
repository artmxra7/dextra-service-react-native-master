import React, { Component } from 'react'
import { Stacknavigator } from 'react-navigation'
import Sparepart from './Sparepart'
import SparepartDetail from './SparepartDetail';

export const Stack =  Stacknavigator({
    Sparepart:{
        screen:Sparepart
    },
    SparepartDetail:{
        screen:SparepartDetail
    },
},{
    
})

export default class Router extends Component{

    render()
    {
        return <Stack/>
    }

}