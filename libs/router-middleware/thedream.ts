import { operate } from '@frrri/routes';
import { getMany } from '@frrri/routes/operators';

const all = 'entities';
const posts = 'entities.posts';
const comments = 'entities.comments';
const users = 'entities.users';

const routes: Routes = [
    {
        path: 'posts',
        data: operate(
            reset(all),
            getMany(posts),
            setMeta({ title: 'Posts' }),
            setBreadcrumb({ title: 'Posts' }),
        ),
        children: [
            {
                path: ':id',
                data: operate(
                    getActive(posts),
                    populate({
                        from: posts,
                        to: comments,
                        id: 'postId',
                        idSource: comments,
                    ),
                    populate({
                        from: comments,
                        to: users,
                        id: 'userId',
                        idSource: comments,
                    ),
                    setMeta({
                        active: posts,
                        factory: post => ({ title: post.title }),
                    }),
                    setBreadcrumb({
                        active: posts,
                        factory: post => ({ title: post.title }),
                    }),
                ),
            },
        ],
    },
];
