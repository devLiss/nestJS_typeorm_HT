import { Injectable } from '@nestjs/common';
import { CommentsSqlRepository } from '../../../../entities/postgres/commentsSql.repository';

@Injectable()
export class CommentsService {
  constructor(private comRepo: CommentsSqlRepository) {}
  async createComment(content: string, postId: string, user: any) {
    const newComment = {
      content: content,
      postId: postId,
      userId: user.id,
      userLogin: user.login,
      createdAt: new Date().toISOString(),
    };

    const createdComment = await this.comRepo.create(newComment);
    console.log(createdComment);

    return createdComment;
  }

  /*async makeLike(commentId: string, user: any, status: string) {
    const commentIdDb = commentId;
    const existedLike = await this.likesRepo.getLikeByCommentIdAndUserId(
      commentId,
      user.id,
    );

    const likeInfo = {
      commentId: new mongoose.Types.ObjectId(commentId),
      userId: new mongoose.Types.ObjectId(user.id),
      login: user.login,
      isBanned: user.banInfo.isBanned,
      status,
      addedAt: new Date().toISOString(),
    };

    let like = null;
    if (existedLike) {
      like = await this.likesRepo.updateLike(likeInfo);
    } else {
      like = await this.likesRepo.createLike(likeInfo);
    }
    return like;
  }*/
}
