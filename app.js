var app = new Framework7({
    el: "#app",
    name: "shadvlxrd",
    theme: "auto",
    popup: {
        closeOnEscape: true,
        swipeToClose: true,
        closeByBackdropClick: true,
        push: true,
    },
    routes: [
        {
            path: "/products/",
            content: `
                <div class="page" data-name="products">
                    <div class="navbar">
                        <div class="navbar-bg"></div>
                        <div class="navbar-inner sliding">
                            <div class="left">
                                <a href="#" class="link back">
                                    <i class="icon icon-back"></i>
                                    <span class="if-not-md">Back</span>
                                </a>
                            </div>
                            <div class="title">Products</div>
                        </div>
                    </div>
                    <div class="page-content">
                        <div class="list separated media-list inset">
                            <ul>
                               <li><a class="item-link external" href="https://www.patreon.com/Outland3r2007/shop/bloom-219712?utm_medium=clipboard_copy&utm_source=copyLink&utm_campaign=productshare_fan&utm_content=join_link"><div class="item-content"><div class="item-media"><img loading="lazy" src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/11213192/30e0099ee7e242879c93851071982e53/eyJ3Ijo2MjB9/1.JPG?token-time=1718668800&token-hash=QZCuBdDdE8Yolgs0T76Frk9hT1QysuRS9Z3eiMYV2_0%3D"></div><div class="item-inner">                     <div class="item-title-row">                         <div class="item-title">Bloom</div></div><div class="item-subtitle"><span class="badge">$3</span></div>                      <div class="item-footer">Wallpapers pack</div></div></div></a></li><li><a class="item-link external" href="https://www.patreon.com/Outland3r2007/shop/glass-219840?utm_medium=clipboard_copy&utm_source=copyLink&utm_campaign=productshare_creator&utm_content=join_link"><div class="item-content"><div class="item-media"><img loading="lazy" src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/11213192/19f825711680436a917f817d02f4763c/eyJ3Ijo2MjB9/1.jpg?token-time=1718668800&token-hash=jaQkV9z-tsHka5eGrj8PEBBUrnJvuVMiKnkLtzOC1UM%3D"></div><div class="item-inner">                     <div class="item-title-row">                         <div class="item-title">Glass</div></div><div class="item-subtitle"><span class="badge">$3</span></div>                      <div class="item-footer">Wallpapers pack</div></div></div></a></li><li><a class="item-link external" href="https://www.patreon.com/Outland3r2007/shop/noise-219625?utm_medium=clipboard_copy&utm_source=copyLink&utm_campaign=productshare_fan&utm_content=join_link"><div class="item-content"><div class="item-media"><img loading="lazy" src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/11213192/a48aed1115134e71a5de0c4056d3d155/eyJxIjoxMDAsIndlYnAiOjB9/1.jpg?token-time=1718668800&token-hash=40Sq9AOXmLmXztJBQ-K8l20rrAVbP1udee-gNFOj1f4%3D"></div><div class="item-inner">                     <div class="item-title-row">                         <div class="item-title">Noise</div></div><div class="item-subtitle"><span class="badge">$3</span></div>                      <div class="item-footer">Wallpapers pack</div></div></div></a></li><li><a class="item-link external" href="https://www.patreon.com/Outland3r2007/shop/spectrum-219871?utm_medium=clipboard_copy&utm_source=copyLink&utm_campaign=productshare_creator&utm_content=join_link"><div class="item-content"><div class="item-media"><img loading="lazy" src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/11213192/4349dd2541b84e20b323b5e32053a5a1/eyJ3Ijo2MjB9/1.JPG?token-time=1718668800&token-hash=6WiJP-l411_r0Q45efXR18XT0aawUYS0KjavN99gSiw%3D"></div><div class="item-inner">                     <div class="item-title-row">                         <div class="item-title">Spectrum</div></div><div class="item-subtitle"><span class="badge">$3</span></div>                      <div class="item-footer">Wallpapers pack</div></div></div></a></li><li><a class="item-link external" href="https://outland3r2007.gumroad.com/l/iOS17Wall?_gl=1*e3of6h*_ga*MjAxOTAzMTcwNi4xNzAzNjk3NDA1*_ga_6LJN6D94N6*MTcwMzY5NzQxMy4xLjEuMTcwMzY5NzQ4MS4wLjAuMA.."><div class="item-content"><div class="item-media"><img loading="lazy" src="https://public-files.gumroad.com/v9qtesyvav1ykqub5xh0jxe4pyus"></div><div class="item-inner">                     <div class="item-title-row">                         <div class="item-title">iOS 17 Concept Wallpapers</div>                       </div><div class="item-subtitle"><span class="badge">Free</span></div>                      <div class="item-footer">Wallpapers pack</div></div></div></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            `,
            options: {

            transition: "f7-circle"

        } 
        },
    ],
});

var mainView = app.views.create(".view-main", {
    main: true,
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".ptr-content").forEach((element) => {
        element.addEventListener("ptr:refresh", () => {
            window.location.reload();
        });
    });
});

function initPhotoBrowser(photos) {
    return app.photoBrowser.create({
        photos: photos.map((photo) => ({ url: photo })),
        type: "standalone",
        theme: "dark",
        navbar: true,
        toolbar: false,
        swiper: {
            zoom: true,
        },
        on: {
            closed: function () {
                app.photoBrowserPopup = null;
            },
        },
    });
}

function openPhotoBrowser(photos) {
    initPhotoBrowser(photos).open();
}

fetch("wallpapers.json")
    .then((response) => response.json())
    .then((wallpapers) => {
        const wallpapersContainer = document.getElementById("wallpapers");
        wallpapers.forEach((wallpaper) => {
            const card = document.createElement("div");
            card.classList.add("card", "card-raised");
            card.innerHTML = `
                <div class="card-content card-content-padding">
                    <div class="card-image" style="text-align: center;">
                        <img loading="lazy" class="newsimg" src="${wallpaper.image}" data-caption="${wallpaper.name}">
                    </div>
                    <div class="card-footer">
                        <a onclick="navigator.share({ title: '${wallpaper.name}', url: '${wallpaper.url}' })">
                            <i class="f7-icons if-not-md">square_arrow_up</i>
                            <i class="material-icons md-only">share</i>
                        </a>
                        <a href="${wallpaper.image}" download="${wallpaper.name}.jpg" class="external">
                            <i class="f7-icons if-not-md">cloud_download_fill</i>
                            <i class="material-icons md-only">download</i>
                        </a>
                    </div>
                </div>
            `;
            wallpapersContainer.appendChild(card);
            card.addEventListener("click", () => {
                openPhotoBrowser([wallpaper.image]);
            });
        });
    });

function createSnowflake() {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.innerHTML = "❄";
    snowflake.style.fontSize = Math.random() * 20 + "px";
    snowflake.style.left = Math.random() * innerWidth + "px";
    snowflake.style.animationDuration = Math.random() * 3 + 2 + "s";
    document.body.appendChild(snowflake);

    snowflake.addEventListener("animationend", () => {
        snowflake.remove();
    });
}

function isWinter() {
    const month = new Date().getMonth() + 1;
    return month === 12 || month === 1 || month === 2;
}

if (isWinter()) {
    setInterval(createSnowflake, 500);

    const snowflakeStyle = document.createElement("style");
    snowflakeStyle.innerHTML = `
        .snowflake {
            position: fixed;
            top: -10px;
            user-select: none;
            pointer-events: none;
            color: #fff;
            z-index: 9999;
            animation: snowfall linear infinite;
        }
        @keyframes snowfall {
            to {
                transform: translateY(${innerHeight}px);
            }
        }
    `;
    document.head.appendChild(snowflakeStyle);
}
