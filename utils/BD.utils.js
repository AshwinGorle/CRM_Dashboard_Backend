export const checkForPotentialRevenue  = (BD)=>{
    if(BD.potentialOffset && BD.potentialTopLine){
        return  BD.potentialTopLine - BD.potentialOffset
    }else{
        return 0;
    }
}