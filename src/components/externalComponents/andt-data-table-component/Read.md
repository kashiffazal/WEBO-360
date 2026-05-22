<DataTable 
    className="pagination-absolute" // -pagination-absolute is a default class to absolute pagination
    classNameContainer="" // Apply at all container including filter dropdowns etc...
    styleType={1}
    columns={columns}
    //label="This is table label"
    //desc="Some demo desc"
    bulkAction={[
    {'label':'Active', 'value':'Active'},
    {'label':'Unsubscribed', 'value':'Unsubscribed'},
    {'label':'Bounce', 'value':'Bounce'},
    {'label':'Spam', 'value':'Spam'},
    ]}
    //bulkActionLabel="Bulk Action"
    bulkActionMsg="Are you sure to delete?"
    bulkActionBottomBtnLabel="Delete Campaigns"
    bulkActionHandler={(rows,value) => console.log(rows,value)}
    dataSource={this.state.listArrayActive}
    //dataAPI={"/listSubscribers/get/get_list_name_or_subscriber_data.php?id="+this.props.match.params.list_id}
    rowSelection={this.handleSelectedRows}
    showSizeChanger={this.handleSizeChanger}
    //sizeChangerOptions={[5,7]}
    filter="true"
    //filterLabel="Filter data"
    //filterCol={["key", "list_name", "dateTime", "totalSubscribers"]}
    //customFilter="true"
    //customFilterLabel="Custom Filter data"
    //customFilterCol={[
      {label : 'User Name', value : 'full_name'},
      {label : 'Email', value : 'email'}
    ]}

    //filterPlaceholder="dd Filter data"
    //sizeChangeLabel="Recore per page"
    expandedRowRender={record => {
                    return (
                      <div>{record}</div>
                    )//End return
                  }}
    pagination={{
    //size:'small',
    itemDetails : true,
    //itemTotal : true,
    //nextPreviousBtn : true,
    //currentPage : 2,
    //simple : false,
    //showSizeChanger : (this.handleSizeChanger),
    //sizeChangerOptions : ['5','7'],
    //showQuickJumper : false,
    defaultPageSize : 5,
    //showOnSinglePage : true
    }}
/>