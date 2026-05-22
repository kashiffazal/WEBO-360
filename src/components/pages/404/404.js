import React, { Component } from 'react';
import { Result, Button } from 'antd';

class _404 extends Component {
    render (){
      return(
        <div className="container_404">
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button onClick={() => window.history.go(-1)} type="primary">Go Back </Button>}
          />
        </div>
    )//End return
  }//End render
}//End class

export default _404;







// //======================
// // IMPORT
// //======================
// import React, { Component } from 'react';
// import Reactable from 'reactable';

// var Table = Reactable.Table,
//     Thead = Reactable.Thead,
//     Th = Reactable.Th,
//     Tr = Reactable.Tr,
//     Td = Reactable.Td;

// //======================
// // Define our table's data
// // Imagine using information acquired from 
// // a database, like list of users
// //======================
// var sgTeams = [
//   {name: "SG-1", leader: "Oneil", assignment: "Exploration", members: 4},
//   {name: "SG-2", leader: "Kawalsky", assignment: "Search and Rescue", members: 5},
//   {name: "SG-3", leader: "Reynolds", assignment: "Marine Combat", members: 10},
//   {name: "SG-4", leader: "Howe", assignment: "Medical", members: 4},
//   {name: "SG-5", leader: "Davis", assignment: "Marine Combat", members: 6},
//   {name: "SG-6", leader: "Fischer", assignment: "Search and Rescue", members: 10},
//   {name: "SG-7", leader: "Isaacs", assignment: "Scientific", members: 6},
//   {name: "SG-8", leader: "Yip", assignment: "Medical", members: 6},
//   {name: "SG-9", leader: "Winters", assignment: "Diplomatic", members: 7},
//   {name: "<b>SG-10</b>", leader: "Colville", assignment: "Military Exploration", members: 5}
// ];

// export default class _404 extends Component {


// //======================
// // Render the table with all of the
// // options included
// //======================
//   renderTable() {
//     return (
//       <Table className="tableStyles-1"
//         filterable={['Name', 'Age']}
//         noDataText="No matching records found"
//         itemsPerPage={50}
//         currentPage={0}
//         sortable={true}
//         >
//         <Tr>
//             <Td column="Name" data="Griffin Smith">
//                 <b>Griffin Smith</b>
//             </Td>
//             <Td column="Age">18</Td>
//         </Tr>
//         <Tr>
//             <Td column="Name">Lee Salminen</Td>
//             <Td column="Age" data="2s23">{ true ? <b>s223</b> : ''}</Td>
//         </Tr>
//         <Tr>
//             <Td column="Name">Developer</Td>
//             <Td column="Age">28</Td>
//         </Tr>
//         <Tr>
//             <Td column="Name">Developer</Td>
//             <Td column="Age">28</Td>
//         </Tr>

//         <Tr>
//             <Td column="Name" data="Griffin Smith">
//                 <b>Griffin Smith</b>
//             </Td>
//             <Td column="Age">18</Td>
//         </Tr>
//         <Tr>
//             <Td column="Name">Lee Salminen</Td>
//             <Td column="Age"><b>23</b></Td>
//         </Tr>
//         <Tr>
//             <Td column="Name">Developer</Td>
//             <Td column="Age">28</Td>
//         </Tr>
//         <Tr>
//             <Td column="Name">Developer</Td>
//             <Td column="Age">28</Td>
//         </Tr>


//         <Tr>
//             <Td column="Name" data="Griffin Smith">
//                 <b>Griffin Smith</b>
//             </Td>
//             <Td column="Age">18</Td>
//         </Tr>
//         <Tr>
//             <Td column="Name">Lee Salminen</Td>
//             <Td column="Age"><b>23</b></Td>
//         </Tr>
//         <Tr>
//             <Td column="Name">Developer</Td>
//             <Td column="Age">28</Td>
//         </Tr>
//         <Tr>
//             <Td column="Name">Developer</Td>
//             <Td column="Age">28</Td>
//         </Tr>

//         <Tr>
//             <Td column="Name" data="Griffin Smith">
//                 <b>Griffin Smith</b>
//             </Td>
//             <Td column="Age">18</Td>
//         </Tr>
//         <Tr>
//             <Td column="Name">Lee Salminen</Td>
//             <Td column="Age"><b>23</b></Td>
//         </Tr>
//         <Tr>
//             <Td column="Name">Developer</Td>
//             <Td column="Age">28</Td>
//         </Tr>
//         <Tr>
//             <Td column="Name">Developer</Td>
//             <Td column="Age">28</Td>
//         </Tr>





//       </Table>
//     )
//   }


// //======================
// // Render our component
// //======================

//   render() {
//       return (
//         <div>
//           {this.renderTable()}
//         </div>
//       )
//   }
// }