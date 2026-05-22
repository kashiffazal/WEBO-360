  constructor(props) {
    super(props);
    this.state = {
      nested_config: {
        initial: {
          rows: {},
          className: "nested_class",
          style: { border: "5px solid red" }
        },
        action_config: {
          col_set: {
            gutter: 20,
            0: { lg: 22, md: 20, sm: 24, xs: 24 },
            1: { lg: 2, md: 4, sm: 24, xs: 24 }
          },
          btn: true
        },
        col_set: {
          gutter: 20,
          0: { lg: 6, md: 12, sm: 12, xs: 24 },
          1: { lg: 6, md: 12, sm: 12, xs: 24 },
          2: { lg: 6, md: 12, sm: 12, xs: 24 },
          3: { lg: 6, md: 12, sm: 12, xs: 24 }
        },
        fields: [
          {
            text: "Nested one %i%"
            //text_align : 'right'
          },
          {
            field: "text",
            name: "kashi",
            label: "kashi_nested name is "
          },
          {
            field: "text",
            name: "siddiq",
            label: "siddiq_nested field"
          },
          {
            field: "text",
            name: "danish",
            label: "danish_nested field"
          }
        ]
      }
    };
    this.state.dynamicFieldsObject = {
      initial: {
        rows: 1,
        className: "dynamic_class",
        style: { border: "5px solid red" }
      },
      action_config: {
        col_set: {
          gutter: 20,
          0: { lg: 22, md: 20, sm: 24, xs: 24 },
          1: { lg: 2, md: 4, sm: 24, xs: 24 }
        },
        btn: true
        //less : true,
        //add_bottom : true,
        //bottom_btn_text : "this si",
      },
      col_set: {
        gutter: 20,
        0: { lg: 6, md: 12, sm: 12, xs: 24 },
        1: { lg: 6, md: 12, sm: 12, xs: 24 },
        2: { lg: 6, md: 12, sm: 12, xs: 24 },
        3: { lg: 6, md: 12, sm: 12, xs: 24 }
      },
      fields: [
        {
          text: "Supporter one %i%"
          //text_align : 'right'
        },
        {
          field: "text",
          name: "siddiq",
          label: "second field"
        },
        {
          field: "select",
          name: "kashif",
          label: "field name is ",
          options: [
            { value: "Support Worker", label: "Support Worker" },
            { value: "Support Coordinator", label: "Support Coordinator" }
          ]
        },
        {
          nestedFields: true,
          //btn_text : 'Nested Fields',
          bnt_type: "dashed"
          //disableAfterOne : false,
        }
      ],
      nested_config: this.state.nested_config
    };
  }//End constructor