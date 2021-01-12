import React, { useState } from 'react';
//import "/Users/samkofi/Desktop/ooomph/oomph-cli/src/css/bootstrap.min.css";
//import "/Users/samkofi/Desktop/ooomph/oomph-cli/src/css/da-slider.css";
//import "/Users/samkofi/Desktop/ooomph/oomph-cli/src/css/isotope.css";
//import "/Users/samkofi/Desktop/ooomph/oomph-cli/src/css/styles.css";

export function Website() {
    return (
        <div>
        <header className="header">
        <section id="section-top" className="section section-top">
            <div className="container">
                <div className="row">
                    <div className="region region-top-first col-xs-12 col-sm-8 col-md-7 col-lg-7">
                        <div className="block-contents ">

                            <div className="content">
                                <ul>
                                    <li><a href="#"><span data-toggle="tooltip" data-placement="bottom" className="superhero-tooltip" data-original-title="Facebook"><i className="fa fa-facebook"><span></span></i></span></a></li>
                                    <li><a href="#"><span data-toggle="tooltip" data-placement="bottom" className="superhero-tooltip" data-original-title="Twitter"><i className="fa fa-twitter"><span></span></i></span></a></li>
                                    <li><a href="#"><span data-toggle="tooltip" data-placement="bottom" className="superhero-tooltip" data-original-title="Instagram"><i className="fa fa-instagram"><span></span></i></span></a></li>
                                    <li><a href="#"><span data-toggle="tooltip" data-placement="bottom" className="superhero-tooltip" data-original-title="Linkedin"><i className="fa fa-linkedin"><span></span></i></span></a></li>
                                </ul>
                            </div>
                        </div>
                        <div style={{clear: 'both'}} className="clear-fix"></div>
                    </div>
                </div>
            </div>
        </section>

        <div className="container">
            <nav className="navbar navbar-inverse" role="navigation">
                <div className="navbar-header">
                    <button type="button" id="nav-toggle" className="navbar-toggle" data-toggle="collapse" data-target="#main-nav">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a href="#" className="navbar-brand scroll-top logo"><b>OOMPH</b></a>
                </div>
                <div id="main-nav" className="collapse navbar-collapse">
                    <ul className="nav navbar-nav" id="mainNav">
                        <li className="active"><a href="#home" className="scroll-link">Home</a></li>
                        <li><a href="#aboutUs" className="scroll-link">About Us</a></li>
                        <li><a href="#services" className="scroll-link">Safety</a></li>
                        <li><a href="#team" className="scroll-link">Drive</a></li>
                        <li><a href="#contactUs" className="scroll-link">Contact Us</a></li>
                    </ul>
                </div>
            </nav>
        </div>
    </header>
    <div id="#top"></div>
    <section id="home">
        <div className="banner-container">
            <img src="images/midnight.png" alt="banner" />
            <div className="container banner-content">
                <div id="da-slider" className="da-slider">
                    <div className="da-slide">
                        <h2>OOMPH Title 1</h2>
                        <p>Amazing OOMPH Subtitle 1</p>
                        <div className="da-img"></div>
                    </div>
                    <div className="da-slide">
                        <h2>OOMPH Title 2</h2>
                        <p>Amazing OOMPH Subtitle 2</p>
                        <div className="da-img"></div>
                    </div>
                    <div className="da-slide">
                        <h2>OOMPH Title 3</h2>
                        <p>Amazing OOMPH Subtitle 3</p>
                        <div className="da-img"></div>
                    </div>
                    <div className="da-slide">
                        <h2>OOMPH Title 4</h2>
                        <p>Amazing OOMPH Subtitle 4</p>
                        <div className="da-img"></div>
                    </div>
                    <nav className="da-arrows">
                        <span className="da-arrows-prev"></span>
                        <span className="da-arrows-next"></span>
                    </nav>
                </div>
            </div>
        </div>
    </section>

    <section id="aboutUs" className="page-section darkBg pDark pdingBtm30">
        <div className="container">
            <div className="heading text-center">
                <h2>OOMPH</h2>
                <p>One of your friends</p>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <img src="images/mobile.png" className="fitImage" alt="img" />
                </div>
                <div className="col-md-8">
                    <h3>Our Company</h3>
                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. </p>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4 col-sm-4">
                    <h3><i className="fa fa-cloud color"></i>&nbsp;Why choose us?</h3>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit occaecat cupidatat non id est laborum.</p>
                </div>
                <div className="col-md-4 col-sm-4">
                    <h3><i className="fa fa-home color"></i>&nbsp;Where are we?</h3>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit occaecat cupidatat non id est laborum.</p>
                </div>
                <div className="col-md-4 col-sm-4">
                    <h3><i className="fa fa-cloud color"></i>&nbsp;Why choose us?</h3>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit occaecat cupidatat non id est laborum.</p>
                </div>
            </div>
        </div>
        <br/><br/>
    </section>
    <section id="services" className="page-section">
        <div className="container">
            <div className="heading text-center">
                <h2>Safety</h2>
                <p>We’re actively monitoring the COVID-19 situation and are continually working to help keep those who rely on our platform healthy and safe.</p>
            </div>
            <div className="row">
                <div className="col-md-4 text-center">
                    <i className="fa fa-lightbulb-o fa-2x circle"></i>
                    <h3>JavaScript <span className="id-color">jQuery</span></h3>
                    <p>Nullam ac rhoncus sapien, non gravida purus. Alinon elit imperdiet congue. Integer ultricies sed elit impe.</p>
                </div>
                <div className="col-md-4 text-center">
                    <i className="fa fa-globe fa-2x circle"></i>
                    <h3>Web <span className="id-color">Designing</span></h3>
                    <p>Nullam ac rhoncus sapien, non gravida purus. Alinon elit imperdiet congue. Integer elit imperdiet conempus.</p>
                </div>
                <div className="col-md-4 text-center">
                    <i className="fa fa-desktop fa-2x circle"></i>
                    <h3>Wordpress <span className="id-color">Dev</span></h3>
                    <p>Nullam ac rhoncus sapien, non gravida purus. Alinon elit imperdiet congue. Integer ultricies sed elit imperdiet congue. Integer ultricies sed ligula eget tempus.</p>
                </div>
            </div>
        </div>
        <br/><br/>
    </section>
    
    <section id="team" className="page-section darkBg pDark pdingBtm30">
        <div className="container">
            <div className="heading text-center">
                <h2>Drive</h2>
                <p>Come drive with us.</p>
            </div>
            <div className="team-content">
                <div className="row">
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="team-member pDark">
                            <div className="member-img">
                                <img className="img-responsive" src="images/apply.png" alt=""/>
                            </div>
                            <h2>Apply</h2>
                            <span className="pos">Link to apply bro cmon</span>
                            <div className="team-socials">
                                <a href="#"><i className="fa fa-facebook"></i></a>
                                <a href="#"><i className="fa fa-twitter"></i></a>
                                <a href="#"><i className="fa fa-instagram"></i></a>
                                <a href="#"><i className="fa fa-github"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="team-member pDark">
                            <div className="member-img">
                                <img className="img-responsive" src="images/talk.png" alt=""/>
                            </div>
                            <h2>Talk</h2>
                            <span className="pos">Discuss details</span>
                            <div className="team-socials">
                                <a href="#"><i className="fa fa-facebook"></i></a>
                                <a href="#"><i className="fa fa-google-plus"></i></a>
                                <a href="#"><i className="fa fa-twitter"></i></a>
                                <a href="#"><i className="fa fa-dribbble"></i></a>
                                <a href="#"><i className="fa fa-github"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="team-member pDark">
                            <div className="member-img">
                                <img className="img-responsive" src="images/learn.png" alt=""/>
                            </div>
                            <h2>Learn</h2>
                            <span className="pos">Learn rules and regulations</span>
                            <div className="team-socials">
                                <a href="#"><i className="fa fa-facebook"></i></a>
                                <a href="#"><i className="fa fa-google-plus"></i></a>
                                <a href="#"><i className="fa fa-twitter"></i></a>
                                <a href="#"><i className="fa fa-dribbble"></i></a>
                                <a href="#"><i className="fa fa-github"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="team-member pDark">
                            <div className="member-img">
                                <img className="img-responsive" src="images/shake.png" alt=""/>
                            </div>
                            <h2>Shake</h2>
                            <span className="pos">Let's make this money</span>
                            <div className="team-socials">
                                <a href="#"><i className="fa fa-facebook"></i></a>
                                <a href="#"><i className="fa fa-google-plus"></i></a>
                                <a href="#"><i className="fa fa-twitter"></i></a>
                                <a href="#"><i className="fa fa-dribbble"></i></a>
                                <a href="#"><i className="fa fa-github"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>


    <section id="contactUs" className="contact-parlex">
        <div className="parlex-back">
            <div className="container">

                <div className="row">
                    <div className="heading text-center">
                        <h2>Contact Us</h2>
                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered.</p>
                    </div>
                </div>

                <div className="row mrgn30">

                    <form method="post" action="" id="contactfrm" role="form">

                        <div className="col-sm-4">
                            <div className="form-group">
                                <label for="name">Name</label>
                                <input type="text" className="form-control" name="name" id="name" placeholder="Enter name" title="Please enter your name (at least 2 characters)"/>
                            </div>
                            <div className="form-group">
                                <label for="email">Email</label>
                                <input type="email" className="form-control" name="email" id="email" placeholder="Enter email" title="Please enter a valid email address"/>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="form-group">
                                <label for="comments">Comments</label>
                                <textarea name="comment" className="form-control" id="comments" cols="3" rows="5" placeholder="Enter your message…" title="Please enter your message (at least 10 characters)"></textarea>
                            </div>
                            <button name="submit" type="submit" className="btn btn-lg btn-primary" id="submit">Submit</button>
                            <div className="result"></div>
                        </div>
                    </form>
                    <div className="col-sm-4">
                        <h4>Address:</h4>
                        <address>
                            OOMPH Technologies<br/>
                            134 Slate Rd., 414515<br/>
                            Atlanta, GA 02434-34534 USA
                        <br/>
                        </address>
                        <h4>Phone:</h4>
                        <address>
                            (+1) 404-495-2332<br/>
                            (+1) 404-495-0862
                        </address>
                    </div>
                </div>
            </div>
            <br/><br/><br/><br/><br/><br/><br/>
            <div className="container">
                <div className="social text-center">
                    <a href="#"><i className="fa fa-twitter"></i></a>
                    <a href="#"><i className="fa fa-facebook"></i></a>
                    <a href="#"><i className="fa fa-linkedin"></i></a>
                    <a href="#"><i className="fa fa-instagram"></i></a>
                </div>
    
                <div className="clear"></div>
            </div>
            <br/>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 text-center">
                        Copyright © 2021 OOMPH Technologies. | All Rights Reserved. Template by WebThemez.
                    </div>
                </div>
            </div>
        </div>
    </section>

    <a href="#top" className="topHome"><i className="fa fa-chevron-up fa-2x"></i></a>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script src="js/modernizr-latest.js"></script>
    <script src="js/jquery-1.8.2.min.js" type="text/javascript"></script>
    <script src="js/bootstrap.min.js" type="text/javascript"></script>
    <script src="js/jquery.isotope.min.js" type="text/javascript"></script>
    <script src="js/fancybox/jquery.fancybox.pack.js" type="text/javascript"></script>
    <script src="js/jquery.nav.js" type="text/javascript"></script>
    <script src="js/jquery.cslider.js" type="text/javascript"></script>
    <script src="js/custom.js" type="text/javascript"></script>
    <script src="js/owl-carousel/owl.carousel.js"></script>

    </div>
    );
}

export default Website;