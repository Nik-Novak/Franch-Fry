//@ts-check
import { Typography } from "@mui/material";
import { connect } from "react-redux";

import NumberFormat from 'react-number-format';
import Metrics from "../components/Metrics/Metrics";
import Filters from "../components/Filters/Filters";
import { useEffect, useState } from "react";
import axios from 'axios';
import store from '../redux/store'
import config from '../config/default.json';
import moment from "moment";
import AppBar from "../components/AppBar/AppBar";
//@ts-ignore
import Style from '../styles/Dashboard.module.css'
import Drawer from "../components/Drawer/Drawer";

const mapState = (state)=>{
  return { 
    firstName: state.login.firstName,
    filter: state.filter,
  }
}

function getSales(filter){
  let token = store.getState().login.token;
  return axios.post('/api/sales', {token, franchisee_ids:filter.franchisees, location_ids:filter.locations, date: filter.date})
}

function getDateTitle(date){
  let today = moment(new Date());
  let yesterday = moment(new Date()).subtract(1,'day');
  let lastweek = moment(new Date()).subtract(7,'day');
  let targetDate = moment(date);
  if(targetDate.isSame(today, 'day'))
    return 'Today';
  if(targetDate.isSame(yesterday, 'day'))
    return 'Yesterday';
  if(targetDate.isBetween(lastweek, today, 'day',"[]"))
    return 'Last ' + targetDate.format('dddd');
  return targetDate.format('MMMM DD, YYYY');
}

function Dashboard( {firstName, filter} ){

  const [totalSales, setTotalSales] = useState(0);
  const [totalFranchiseFees, setTotalFranchiseFees] = useState(0);

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(()=>{
    getSales(filter)
      .then(response=>{
        let {total_sales, total_franchise_fees} = response.data;
        setTotalSales(()=>{
          setTotalFranchiseFees(total_franchise_fees);
          return total_sales;
        })
      });
  }, [filter]);
  return (
    <>
      <AppBar title={'Overview'}/>
      {/* <Drawer open={drawerOpen} setOpen={setDrawerOpen} /> */}
      <div className={Style.content}>
        <Typography variant="h2">Welcome {firstName}!</Typography>
        <Typography variant="h3">{getDateTitle(filter.date)}'s Metrics!</Typography>
        <Metrics 
          metrics={[
            {name: 'Total Sales', value: totalSales, prefix:'$', suffix:'', thousandSeparator:true, decimals:2},
            {name: 'Total Franchise Fees', value:totalFranchiseFees, prefix:'$', suffix:'', thousandSeparator:true, decimals:2},
          ]} 
        />

        <Filters />
      </div>
    </>
  );
}

export default connect(mapState)(Dashboard);