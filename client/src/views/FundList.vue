<template>
    <div class="fillContainer">
        <div>
            <el-form :inline="true" ref="add_data">
                <el-form-item label="投标时间筛选:">
                    <el-date-picker
                        v-model="search_data.startTime"
                        type="datetime"
                        placeholder="选择开始时间">
                    </el-date-picker> --
                    <el-date-picker
                        v-model="search_data.endTime"
                        type="datetime"
                        placeholder="选择结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size ="small" icon="search" @click='onScreeoutMoney()'>筛选</el-button>
                </el-form-item>
                <el-form-item class="btnRight">
                    <el-button type="primary" size="small" icon="view" @click="handleAdd()">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
          <el-table
            v-if="tableData.length > 0"
            :data="tableData"
            style="width: 100%"
            maxHeight="450">
            <el-table-column
                label="序号"
                width="50"
                prop="id"
                align="center">
            </el-table-column>
            <el-table-column
                label="创建时间"
                width="250"
                align="center">
                <template slot-scope="scope">
                    <el-icon name="time"></el-icon>
                    <span style="margin-left: 10px">{{ scope.row.date }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="收支类型"
                width="150"
                prop="type"
                align="center">
            </el-table-column>
            <el-table-column
                label="金额"
                width="150"
                prop="incode"
                align="center">
            </el-table-column>
            <el-table-column
                label="支出"
                width="150"
                prop="expend"
                align="center">
            </el-table-column>
            <el-table-column
                label="描述"
                width="150"
                prop="descs"
                align="center">
            </el-table-column>
            <el-table-column
                label="操作"
                 prop="operation"
                 align="center"
                 fixed="right">
                <template slot-scope="scope">
                    <el-button
                        type="warning"
                        size="small"
                        icon="update"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                        icon="delete"
                        size="small"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
          </el-table>
            <!--分页-->
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="paginations.page_index"
                            :page-sizes="paginations.page_sizes"
                            :page-size="paginations.page_size"
                            :layout="paginations.layout"
                            :total="paginations.total">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
        <DiaLog :dialog="dialog"
                @update="getProfile"
             :formData="formData">

        </DiaLog>
    </div>
</template>

<script>
    import DiaLog from '../components/DiaLog.vue'
    export default{
        components:{
            DiaLog
        },
        name: 'fundList',
        data(){
            return{
                search_data:{
                    startTime:"",
                    endTime:""
                },
                paginations:{
                    page_index:1,//当前页
                    total:0,//总数
                    page_size:5,//一页显示条数
                    page_sizes:[5,10,15,25],//每页显示条数
                    layout: "total,sizes,prev,pager,next,jumper"//翻页属性
                },
                tableData:[],
                allTableData:[],
                formData:{
                    id:"",
                    type:"",
                    incode:"",
                    expend:"",
                    descs:""
                },
                dialog:{
                    show:false,
                    title:"",
                    option: "edit"
                }
            }
        },
        created(){
           this.getProfile();
        },
        methods:{
            getProfile(){
                this.$axios.get("/api/profiles/all")
                    .then(res=>{
                        this.allTableData = res.data;
                        //设置分页数据
                        this.setPaginations();
                    })
            },
            setPaginations(){
                //分页属性设置
                this.paginations.total = this.allTableData.length;
                this.paginations.page_index = 1;
                this.paginations.page_size = 5;
                //设置默认的分页数据
                this.tableData = this.allTableData.filter((item,index)=>{
                    return index < this.paginations.page_size
                });
            },
            handleEdit(index,row){
              this.dialog ={
                  show: true,
                  title: "修改信息",
                  option: 'edit'
              };
              this.formData = {
                  type: row.type,
                  incode:row.incode,
                  expend:row.expend,
                  descs:row.descs,
                  id:row.id
              }
            },
            handleDelete(index,row){
                this.$message.info({
                    message: "开发中..",
                    type: 'info'
                })
            },
            handleAdd(){
                this.dialog ={
                    show: true,
                    title: "添加信息",
                    option: 'add'
                };
                this.formData = {
                    type: '',
                    incode:'',
                    expend:'',
                    descs:'',
                    id:''
                }
            },
            handleSizeChange(page_size){
                //切换size
                this.paginations.page_index = 1;
                this.paginations.page_size = page_size;
                this.tableData = this.allTableData.filter((item,index)=>{
                    return index < page_size;
                });
            },
            handleCurrentChange(page){
                //获取当前页
                let index = this.paginations.page_size * (page - 1)
                let nums = this.paginations.page_size * page
                //容器
                let tables = [];
                for(let i = index; i<nums; i++){
                    if(this.allTableData[i]){
                        tables.push(this.allTableData[i]);
                    }
                    this.tableData = tables;
                }
            },
            onScreeoutMoney(){
                console.log(this.search_data.startTime)
            }
        }
    }
</script>

<style scoped>
    .fillContainer {
        width: 100%;
        height: 100%;
        padding: 16px;
        box-sizing: border-box;
    }
    .btnRight {
        float: right;
    }
    .pagination {
        text-align: right;
        margin-top: 10px;
    }
</style>
