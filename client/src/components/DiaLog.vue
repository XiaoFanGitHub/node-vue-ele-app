<template>
    <div class="dialog">
        <el-dialog
        :title="dialog.title"
        :visible.sync="dialog.show"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :modal-append-to-body="false"
        >
            <div class="form">
                <el-form ref="form"
                         :model="formData"
                         :rules="rules"
                         labelWidth="120px"
                         style="margin: 10px;width: auto">
                    <el-form-item label="收支类型">
                        <el-select v-model="formData.type">
                            <el-option v-for="(type,index) in format_type_list"
                                       :key="index" :lable="type" :value="type">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="descs" label="描述:">
                        <el-input type="descs" v-model="formData.descs"></el-input>
                    </el-form-item>
                    <el-form-item prop="incode" label="金额:">
                        <el-input type="incode" v-model="formData.incode"></el-input>
                    </el-form-item>
                    <el-form-item prop="expend" label="支出:">
                        <el-input type="expend" v-model="formData.expend"></el-input>
                    </el-form-item>

                    <el-form-item  class="text_right">
                        <el-button @click="dialog.show = false">取 消</el-button>
                        <el-button type="primary" @click='onSubmit("form")'>提  交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default{
        props:{
            dialog:Object,
            formData:Object
        },
        data(){
            return{

                format_type_list: [
                    "提现",
                    "提现手续费",
                    "充值",
                    "优惠券",
                    "充值礼券",
                    "转账"
                ],
                rules:{

                }
            }

        },
        methods:{
            onSubmit(form){
                this.$refs[form].validate(valid=>{
                    if(valid){
                        const url = this.dialog.option == "add" ? "add" : `edit/${this.formData.id}`
                       this.$axios.post(`/api/profiles/${url}`,this.formData)
                           .then(res=>{
                               this.$message({
                                   message: "添加成功",
                                   type: 'success'
                               });
                               this.dialog.show = false;//隐藏
                               this.$emit('update');

                           });
                    }
                })
            }
        }
    }
</script>

<style>

</style>
