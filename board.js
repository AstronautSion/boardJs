function AllDataBoard(option){
    this.firstView = option.firstView || false; //처음실행할지 말지
    this.targetBoard = option.targetBoard; //게시판 id
    this.targetPage = option.targetPage;
    this.totalData = option.totalData;    // 총 데이터 수
    this.dataPerPage = option.dataPerPage;    // 한 페이지에 나타낼 데이터 수
    this.pageCount = option.pageCount;        // 한 화면에 나타낼 페이지 수
    this.createBoardList = option.createBoardList;

    this.currentPageClone = null;
    this.currentPage = 1;

    this.totalPage = null;
    this.pageGroup = null;

    this.last = null;
    this.first = null;
    this.next = null;
    this.prev = null;

    this.tableInner = '';
    this.pageInner = '';

    this.paging();
    
}

AllDataBoard.prototype = {

    paging: function(){
        
        if(this.currentPageClone){
            this.currentPage = this.currentPageClone;
        }
        var that = this;
        
        this.totalPage = Math.ceil(this.totalData/this.dataPerPage);    // 총 페이지 수
        if(Math.ceil(this.totalData/ this.dataPerPage) < this.pageCount){
            this.pageCount = Math.ceil(this.totalData/ this.dataPerPage);
        }
        this.pageGroup = Math.ceil(this.currentPage/this.pageCount);    // 페이지 그룹

        this.last = Number(this.pageGroup) * Number(this.pageCount);    // 화면에 보여질 마지막 페이지 번호
        //console.log(this.targetBoard, this.last,this.pageGroup,  this.pageCount)
        if(this.last > this.totalPage){
            this.last = this.totalPage;
        } 
        this.first = this.last - (this.pageCount-1);    // 화면에 보여질 첫번째 페이지 번호
        this.next = Number(this.currentPage) + 1;
        this.prev = Number(this.currentPage) - 1; 
        

        /*  pagenation create html  */
        this.pageInner = '';

        if(this.prev > 0){
            this.pageInner += '<a class="page-link" data-page="first"> <span class="page-first"></span></a>'
                            +'<a class="page-link" data-page="prev"> <span class="page-prev">prev</span></a>';
        }else{
            this.pageInner +='<span class="page-disable"><span class="page-first"></span></span>' 
                            +'<span class="page-disable"><span class="page-prev">prev</span></span>';
        }
        for(var i=this.first; i <= this.last; i++){
            this.pageInner += '<a data-page="'+i+'" class="page-link">'+i+'</a>';
        }
        if(this.currentPage < this.totalPage){
            this.pageInner +='<a data-page="next" class="page-link"><span class="page-next"></span></a>' 
                            +'<a data-page="last" class="page-link"><span class="page-last"></span></a>';
        }else{
            this.pageInner +='<span class="page-disable"><span class="page-next">next</span></span>'
                            +'<span class="page-disable"><span class="page-last"></span></span>';
        }

        $(this.targetPage).html(this.pageInner);    // 페이지 목록 생성



        /*  pagenation active event  */
        $(this.targetPage).find('.page-link').removeClass('active');
        $(this.targetPage).find('.page-link').each(function(i, e){
            if( that.currentPage == $(e).data('page')){
                $(e).addClass('active');
            }
        });
        $(this.targetPage).find('.page-link').click(function(){
            var $id = $(this).data('page');
            that.currentPageClone = $(this).text();
            if($id == "next") {that.currentPageClone = that.next;}
            if($id == "prev") {that.currentPageClone = that.prev;}
            if($id == "first") {that.currentPageClone = 1;}
            if($id == "last") {that.currentPageClone = that.totalPage;}

            that.paging();
            // click시 해당 table 위치로 이동
            //$('html, body').stop().animate({ scrollTop: $(that.targetBoard).offset().top - 60 },200);
        });

        this.boardList();
    },
    boardList : function(){
        var nowPage = ((this.currentPage - 1)*this.dataPerPage);
        var resultMaxPage = 0;
        ( this.totalData < nowPage + this.dataPerPage ) ? 
            resultMaxPage = this.totalData : 
            resultMaxPage = nowPage + this.dataPerPage;
        
        if(this.firstView == true){
            this.firstView = false;
        }else{
            this.createBoardList(nowPage, resultMaxPage);
        }
    },
}
