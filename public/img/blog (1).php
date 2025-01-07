<?php include_once("app-data/system-conn.php");?>
<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Basic -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- Mobile Metas -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1">
    <!-- Site Metas -->
    <title>SR Wealth ELITE</title>
    <meta name="keywords" content="">
    <meta name="description" content="">
    <meta name="author" content="">
    <!-- Site Icons -->
    <link rel="icon" href="images/fevicon/fevicon.gif" type="image/gif" />
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="css/bootstrap.min.css" />
    <!-- Site CSS -->
    <link rel="stylesheet" href="css/style.css" />
    <!-- Responsive CSS -->
    <link rel="stylesheet" href="css/responsive.css" />
    <!-- Colors CSS -->
    <link rel="stylesheet" href="css/colors.css" />
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/custom.css" />
    <!-- Counter CSS -->
    <link rel="stylesheet" href="css/jquery.countdown.css" />
    <!-- Wow Animation CSS -->
    <link rel="stylesheet" href="css/animate.css" />
    <!-- Market value slider CSS -->
    <link rel="stylesheet" type="text/css" href="css/carouselTicker.css" media="screen" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css" rel="stylesheet" media="all">
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
      <![endif]-->
<?php include_once("google-analytics.php");?>
</head>

<body id="default_theme" class="inner_page">
    <!-- loader -->
    <div class="bg_load">
        <img class="loader_animation" src="images/loaders/Loader_img.png" alt="#" />
    </div>
    <!-- end loader -->
    <!-- header -->
          <?php include_once("header.php");?>
    <!-- end header -->
    <!-- market value slider -->
    <?php //include_once("srmarquee.php");?>
    <!-- market value slider end -->

    <section id="inner_page_infor" class="innerpage_banner">
        <div class="container">
            <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="full">
                        <div class="inner_page_info">
                            <h3>Blog</h3>
                            <ul>
                                <li><a href="index.php">Home</a></li>
                                <li><i class="fa fa-angle-right"></i></li>
                                <li><a href="blog.php">Blog</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- section -->

    <!-- end section -->

    <!-- section -->
    <section class="layout_padding">
        <div class="container">
            <div class="row">
                
                   <div class="col-lg-9 col-md-9 col-sm-9 col-xs-12 pull-right">
                    <div class="full">
                        <?php fetch_article_thumb();?>
                    </div>
                </div>
                
                
                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 pull-left">
                    <div class="side_bar">
                        <div class="side_bar_blog">
                            <h4>SEARCH</h4>
                            <form action="search.php" method="post" name="search" id="search">
                            <div class="side_bar_search">
                                <div class="input-group stylish-input-group">
                                    <input class="form-control" placeholder="" type="text" required id="txt_ser" name="txt_ser">
                                    <span class="input-group-addon">
                              <button type="submit"><i class="fa fa-search" aria-hidden="true"></i></button>  
                              </span>
                                </div>
                            </div>
                            </form>
                        </div>                        
                        <div class="side_bar_blog">
                            <h4>CATEGORIES</h4>
                            <div class="categary">
                                <ul>
                                    <?php fetch_article_tags(1,"blog.php");?>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>















    <!-- end section -->

    <!-- footer -->    
    
     <?php include_once("footer.php");?>  
    
    <!-- search form -->
    <!-- Modal -->
    <div class="modal fade" id="search_form" role="dialog">
        <button type="button" class="cross_btn close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>
        <div class="search_bar_inner">
            <form class="search_bar_inner_form" action="index.php">
                <div class="field_form">
                    <input type="text" placeholder="Search" />
                    <button type="submit"><i class="fa fa-search" aria-hidden="true"></i></button>
                </div>
            </form>
        </div>
    </div>
    <!-- end search form -->
    <!-- jQuery (necessary for Bootstrap's JavaScript) -->
    <script src="js/jquery.min.js"></script>
    <script src="js/custom.js"></script>
</body>

</html>