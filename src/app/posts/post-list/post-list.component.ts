import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from 'rxjs';
import { AuthService } from "src/app/auth/auth.service";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { MapService } from "./map.service";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { ElementRef } from "@angular/core";
import { antPath } from 'leaflet-ant-path';
import * as L from 'leaflet';
import "leaflet-mouse-position";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("toggleElement") ref: ElementRef;
  @ViewChild("panelElement") ref2: ElementRef;

  posts: Post[] = [];
  mapPosts: Post[] = [];
  map:any;
  layer:any;
  pathLayer:any;
  isLoading = false;
  addFirstLayer = true;
  checked: boolean;
  expanded: boolean;
  totalPosts = 0;
  postsPerPage = 3;
  currentPage = 1;
  pageSizeOptions = [1,3,5,10,20];
  userIsAuthenticated = false;
  userId: string;
  mousePosition:any;

  private latlng:any;
  private coords:any;
  private incrementor = 0;
  private coordsList:any;

  private postsSub: Subscription;
  private mapSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    public MapService: MapService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    //set intitial variables
    this.isLoading = true;
    this.checked = true;

    //get posts for feed
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });

    //check auth
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.
      getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
    });
  }

  ngAfterViewInit(){
    //initialize map and get all posts (will change)
    this.initMap();
    this.MapService.getPosts();
    this.userId = this.authService.getUserId();
    this.mapSub = this.MapService.getPostUpdateListener()
      .subscribe((mapPosts: Post[]) => {
        this.incrementor = 0;
        this.coordsList = [];
        this.coords = [];
        for(const c of mapPosts) {
          //convert latlng to array of numbers
          this.latlng = c.latlng[0].toString().match(/[-+]?[0-9]*\.?[0-9]+/g);
          //coords is used for circle marker
          this.coords = [Number(this.latlng[0]), Number(this.latlng[1])];
          const shorterCoords = "Latlng: " + (Number(this.latlng[0]).toFixed(4) + " " + Number(this.latlng[1]).toFixed(4));
          //coords list is used for antPath
          this.coordsList[this.incrementor] = this.coords;
          this.incrementor += 1;

          //add circle marker with post content
          const circlemarker = new L.CircleMarker(this.coords, {
            color: "#2196f3"
          });
          circlemarker.bindPopup(
            `<center style="width: 175px;">
            <p>
              ${c.title}
            </p>
            <p>
              ${shorterCoords}
            </P>
            <img style="
                max-width: -webkit-fill-available;
                border-radius: 4px;
                box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);"
              src="${c.imagePath}"/>
            </br>
              <strong><p>${c.content}</p></strong>
            </center>`
            )
          this.layer.addLayer(circlemarker);
        }

        //add temporary path layer
        if (this.coordsList.length > 1 && this.addFirstLayer == true){
          this.pathLayer = L.layerGroup().addTo(this.map);
          antPath(this.coordsList,
            {color: '#1976d2',
            weight: 10,
            opacity: 0.6,
            delay: 700
          }).addTo(this.pathLayer);
          this.addFirstLayer = false;
        }

        //center map if coords exist
        if (this.coordsList[0]) {
          this.centerMap();
        }
      });

      //check auth
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService.
        getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
      });
  }

  //get posts based on paginator
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  //update components for a deleted post
  onDelete(postId: string) {
    this.isLoading = true;
    this.map.removeLayer(this.layer);

    //remove path if there are multiple posts
    if (this.coordsList[1]) {
      this.map.removeLayer(this.pathLayer);
    }

    //refresh posts
    this.layer = L.layerGroup().addTo(this.map);
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
      this.MapService.getPosts();
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.mapSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  //map component
  private initMap() {
    this.map = L.map('map').setView([39.8283, -98.5795],3);
        L.tileLayer(
          'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3VicmF0MDA3IiwiYSI6ImNrYjNyMjJxYjBibnIyem55d2NhcTdzM2IifQ.-NnMzrAAlykYciP4RP9zYQ',
          {
            attribution:
              'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 24,
            minZoom: 3,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'your.mapbox.access.token',
          }
        ).addTo(this.map);

    //map layer
    this.layer = L.layerGroup().addTo(this.map);

    //mouse position
    this.mousePosition = L.control.mousePosition({
        position: 'bottomleft',
        emptyString: '',
      }
    ).addTo(this.map);
  }

  //center map based on first coord (could be changed to fitBounds)
  centerMap() {
    this.map.setView(this.coordsList[0], 15);
  }

  //mat expansion panel is expanded
  togglePopup($event,postId) {
    //get post
    this.postsService.getPost(postId).subscribe((post) => {
      //if expansion pandel is open
      if ($event == true) {
        //latlng to array
        const latlng = post.latlng.toString().match(/[-+]?[0-9]*\.?[0-9]+/g);
        const coords = [Number(latlng[0]), Number(latlng[1])];
        const shorterCoords = "Latlng: " + (Number(latlng[0]).toFixed(4) + " " + Number(latlng[1]).toFixed(4));

        //add popup
        const popup = new L.Popup();
        //set options
        popup.setLatLng(coords)
        .setContent(
          `<center>
          <p>
            ${post.title}
          </p>
          <p>
            ${shorterCoords}
          </P>
          </center>`
          ).openOn(this.map);
      } else {
        this.map.closePopup();
      }
    });
  }

  //toggle path switch is active
  togglePath($event: MatSlideToggleChange) {
    //remove initial layer
    if(this.addFirstLayer == false){
      this.map.removeLayer(this.pathLayer);
    }
    //add antpath if posts > 1
    if (this.coordsList.length > 1 && ($event.checked == true)){
      this.pathLayer = L.layerGroup().addTo(this.map);
      antPath(this.coordsList,
        {color: '#1976d2',
        weight: 10,
        opacity: 0.6,
        delay: 700
      }).addTo(this.pathLayer);
    } else {
      this.map.removeLayer(this.pathLayer);
    }
  }
}
