import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Post } from "../post.model";

@Injectable({ providedIn: "root" })
export class MapService {
    private posts: Post[] = [];

    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) {}

    //get all posts (will change to be able to query)
    getPosts() {
      this.http
        .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
        .pipe(
          map(postData => {
            return postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                latlng: post.latlng,
              };
            });
          })
        )
        .subscribe(transformedPosts => {
          this.posts = transformedPosts;
          this.postsUpdated.next([...this.posts]);
        });
    }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

}
