import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  locationPreview: string;
  private mode = "create";
  private postId: string;
  latlng: number;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {

    const now = new Date().toLocaleString();
    this.locationPreview = "";

    this.form = new FormGroup({
      title: new FormControl(now, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      latlng: new FormControl([-1,-1], { validators: [Validators.required] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            latlng: postData.latlng,
            creator: postData.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
            latlng: this.post.latlng
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSetLocation(){
    //check for allow location
    this.isLoading = true;
    if (!navigator.geolocation) {
      console.log('Error: The Geolocation service failed.');
      this.locationPreview = 'Please Allow Geolocation Services';
    }
    this.locationPreview = 'Fetching Current Location...'
    //get location
    navigator.geolocation.getCurrentPosition((position) => {
      const coords = position.coords;
      this.form.value.latlng = `${position.coords.latitude}, ${position.coords.longitude}`;
      console.log(this.form.value.latlng);
      this.locationPreview = 'Location Recieved!';
    },
    () => {this.locationPreview = 'Location Not Found!';}
    );
    this.isLoading = false;
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
        this.form.value.latlng
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
        this.form.value.latlng
      );
    }
    this.form.reset();
  }
}
