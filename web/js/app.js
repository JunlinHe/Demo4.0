/**
 * Created by User on 2015/9/30.
 */
$(function () {

//        滚动条
    $('.sky-custom-container').slimScroll({
        color: '#00f',
        size: '10px',
        height: 'auto',
        alwaysVisible: true
    });

    function dynamicDataSource(openedParentData, callback) {
        var childNodesArray = [];

        // call API, posting options
        $.ajax({
            'type': 'post',
            'url': '/tree/data',
            'data': openedParentData  // first call with be an empty object
        }).done(function(data) {
            // configure datasource
            var childObjectsArray = data;

            // pass an array with the key 'data' back to the tree
            // [ {'name': [string], 'type': [string], 'attr': [object] } ]
            callback({
                data: childNodesArray
            });

        });
    }
    function staticDataSource(openedParentData, callback) {
        console.log(openedParentData);
        childNodesArray = [
            {
                "name": "分组一",
                "type": "folder",
                "attr": {
                    "id": "group1"
                }
            },
            {
                "name": "分组二",
                "type": "folder",
                "attr": {
                    "id": "group2"
                }
            }
        ];

        callback({
            data: childNodesArray
        });
    }


    $('#myTree').tree({
        dataSource: staticDataSource,
        multiSelect: false,
        folderSelect: false
    });

    $('[data-toggle="tooltip"]').tooltip();

    //bootstrap-table 本地数据
    var table_colums=[
        {field: 'state',checkbox: true,align: 'center',valign: 'middle'},
        {title: '序号',field: 'id',align: 'center',valign: 'middle',sortable: true},
        {
            title: '姓名',field: 'name',align: 'center',valign: 'middle',sortable: true,
            editable: {
                type: 'text',//text|textarea|select|date|checklist
                title: '修改姓名',
                validate: function (value) {
                    value = $.trim(value);
                    if (!value) {
                        return '请输入有效内容';
                    }
                    var data = $table.bootstrapTable('getData'),
                        index = $(this).parents('tr').data('index');
                    console.log(data[index]);
                    return '';
                }
            }

        },
        {
            title: '年龄',field: 'age',align: 'center',valign: 'middle',sortable: true,
            editable: {
                type: 'text',
                title: '修改年龄',
                //url: function(params) {
                //    var d = new $.Deferred;
                //    if(params.value === 'abc') {
                //        return d.reject('error message'); //returning error via deferred object
                //    } else {
                //        //async saving data in js model
                //        someModel.asyncSaveMethod({
                //                ...,
                //            success: function(){
                //                d.resolve();
                //            }
                //        });
                //        return d.promise();
                //    }
                //},
                validate: function (value) {
                    value = $.trim(value);
                    if (!value) {
                        return '请输入有效内容';
                    }
                    if (!/^[0-9]*$/.test(value)) {
                        return '必须是数字'
                    }
                    var data = $table.bootstrapTable('getData'),
                        index = $(this).parents('tr').data('index');
                    console.log(data[index]);
                    return '';
                }
            }
        },
        {title: '性别',field: 'gender',align: 'center',valign: 'middle',sortable: true,editable: true},
        {title: '备注',field: 'desc',align: 'center',valign: 'middle',sortable: true,editable: true}
    ], table_data=[
        {'id':'1','name':'张一','age':25,'gender':1,'desc':'哈哈'},
        {'id':'2','name':'张二','age':24,'gender':1,'desc':'哈哈'},
        {'id':'3','name':'张三','age':23,'gender':1,'desc':'哈哈'},
        {'id':'4','name':'张四','age':22,'gender':1,'desc':'哈哈'},
        {'id':'5','name':'张五','age':21,'gender':1,'desc':'哈哈'},
        {'id':'6','name':'张六','age':20,'gender':1,'desc':'哈哈'},
        {'id':'7','name':'张七','age':19,'gender':1,'desc':'哈哈'},
        {'id':'8','name':'张八','age':18,'gender':1,'desc':'哈哈'},
        {'id':'9','name':'张九','age':17,'gender':1,'desc':'哈哈'},
        {'id':'10','name':'张十','age':16,'gender':1,'desc':'哈哈'},
        {'id':'11','name':'张十一','age':15,'gender':1,'desc':'哈哈'},
        {'id':'12','name':'张十二','age':14,'gender':1,'desc':'哈哈'}
    ];
    var $table = $('#bttable'),
        $remove = $('#deleteRow'),
        selections = [];

    $table.bootstrapTable({
        //classes:'',
        clickToSelect:true,
        columns:table_colums,
        data:table_data,
        toolbar:'#toolbar',
        sidePagination: 'client', // client or server
        //totalRows: 0, // server side need to set
        pagination: true,
        pageSize: 5,
        pageList: [5, 10, 50, 100],
        idField:'id',//id字段
        search: true,
        showColumns: true,
        showRefresh: true,
        showToggle: true,//显示切换卡片列表
        showExport: true,
        exportTypes: ['json', 'xml', 'txt', 'excel', 'doc', 'powerpoint', 'pdf'],
        striped:true,
        responseHandler:responseHandler

    }).on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table',function(){
        //控制按钮是否可用
        $('#play,#pause,#stop,#volume,#restart,#deleteRow').prop('disabled',!$table.bootstrapTable('getSelections').length);

        // save your data, here just save the current page
        selections = getIdSelections();
        // push or splice the selections if you want to save all data selections
    });

    $remove.click(function () {
        var ids = getIdSelections();
        $table.bootstrapTable('remove', {
            field: 'id',
            values: ids
        });
        $remove.prop('disabled', true);
    });

    function getIdSelections() {
        return $.map($table.bootstrapTable('getSelections'), function (row) {
            return row.id
        });
    }

    function responseHandler(res) {
        alert(res);
        $.each(res.rows, function (i, row) {
            row.state = $.inArray(row.id, selections) !== -1;
        });
        return res;
    }
});