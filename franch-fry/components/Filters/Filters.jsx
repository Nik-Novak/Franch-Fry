//@ts-check

import DatePicker from '../DatePicker/DatePicker';
import { useEffect, useState } from 'react';
import Autocomplete from '../Autocomplete/Autocomplete';
import { updateDate, updateFranchisees, updateLocations } from '../../redux/actions/filter-actions';
import store from '../../redux/store';
import axios from 'axios';
//@ts-ignore
import Style from './Filters.module.css'
import { Box, Fab, Popover, Stack, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList'

function getNewFranchiseeOptions(newLocObjs){
  return new Promise((resolve, reject)=>{
    let token = store.getState().login.token;
    axios.post('/api/franchisees', {token, location_ids:newLocObjs.map(nlo=>nlo?._id)}).then(response=>resolve(response.data));
  });
}

const fullNameToId = (name, option)=>{
  let [firstName, lastName] = name.split(' ');
  if(option.first_name == firstName && option.last_name == lastName)
    return option._id;
}
function getNewLocationOptions(newFranchObjs){
  return new Promise((resolve, reject)=>{
    let token = store.getState().login.token;
    axios.post('/api/locations', {token, franchisee_ids:newFranchObjs.map(nfo=>nfo?._id)}).then(response=>resolve(response.data));
  });
}

function Filters(){

  const [date, setDate] = useState(new Date());
  const [selectedFranchisees, setSelectedFranchisees] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [franchiseeOptions, setFranchiseeOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);

  const [filtersPopoverAnchorElem, setFiltersPopoverAnchorElem] = useState(null);

  useEffect(()=>{
    let token = store.getState().login.token;
    axios.post('/api/franchisees', {token}, {})
      .then(response=>setFranchiseeOptions(response.data));
    axios.post('/api/locations', {token}, {})
    .then(response=>setLocationOptions(response.data));
  },[]);

  const handleDateChange = (newDate)=>{
    setDate( newDate );
    store.dispatch(updateDate( newDate ));
  }

  const handleFranchiseesChange = (newSelectedFranchisees) =>{
    let newFranchObjs = newSelectedFranchisees.map(nsf=>franchiseeOptions.find(fo=>fullNameToId(nsf, fo)));
    getNewLocationOptions(newFranchObjs)
      .then(newLocationOptions=>setLocationOptions(newLocationOptions));
    setSelectedFranchisees(newSelectedFranchisees);
    store.dispatch(updateFranchisees(newFranchObjs));
  }

  
  const handleSelectedLocationsChange = (newSelectedLocations) =>{
    let newLocObjs = newSelectedLocations.map(nsl=>locationOptions.find(lo=>lo.address==nsl));
    getNewFranchiseeOptions(newLocObjs)
      .then(newFranchiseeOptions=>setFranchiseeOptions(newFranchiseeOptions));
    setSelectedLocations(newSelectedLocations);
    store.dispatch(updateLocations(newLocObjs));
  }

  const handleFabClick = (event) =>{
    setFiltersPopoverAnchorElem(event.target);
  }

  const handlePopoverClose = ()=>{
    setFiltersPopoverAnchorElem(null);
  }

  const isPopoverOpen = Boolean(filtersPopoverAnchorElem);

  return(
    <div className={Style.filters}>
      <Fab 
        sx={{position: 'fixed', bottom:'2vh'}} 
        variant="extended"
        onClick={handleFabClick}
        >
        <FilterListIcon sx={{ mr: 1 }} />
        Filter
      </Fab>
      <Popover
        open={isPopoverOpen}
        anchorEl={filtersPopoverAnchorElem}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <Box sx={{p:4}}>
          <Stack spacing={1}>
            <DatePicker value={date} onChange={handleDateChange}/>
            <Autocomplete multiple value={selectedFranchisees} onChange={handleFranchiseesChange} options={franchiseeOptions.map(fo=>fo.first_name + ' ' + fo.last_name)} />
            <Autocomplete multiple value={selectedLocations} onChange={handleSelectedLocationsChange} options={locationOptions.map(lo=>lo.address)} />
          </Stack>
        </Box>
      </Popover>
      
    </div>
  );

}

export default Filters;